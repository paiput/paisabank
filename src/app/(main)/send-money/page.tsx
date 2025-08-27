"use client"

import { useState } from "react"
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/lib/layout/components/ui/button"
import { Input } from "@/lib/layout/components/ui/input"
import { Card, Currency } from "@prisma/client"
import { useCards } from "@/lib/cards/hooks/useCards"
import { useAudio } from "@/lib/core/hooks"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type SendMoneyStep = "recipient" | "amount" | "confirmation" | "success"

interface RecipientData {
  identifier: string
  accountType: "alias" | "cbu"
  holderName?: string
}

interface TransactionData {
  recipient: RecipientData
  amount: number
  currency: Currency
  selectedCard: Card
}

export default function SendMoney() {
  const router = useRouter()
  const { cards, loading: cardsLoading } = useCards()
  const { playSuccessSound } = useAudio()
  const [currentStep, setCurrentStep] = useState<SendMoneyStep>("recipient")
  const [transactionData, setTransactionData] = useState<Partial<TransactionData>>({})

  // Step 1: Recipient validation
  const [recipientInput, setRecipientInput] = useState("")
  const [isValidating, setIsValidating] = useState(false)

  // Step 2: Amount selection
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(Currency.ARS)
  const [amount, setAmount] = useState("")
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null)

  // Step 3: Confirmation
  const [isProcessing, setIsProcessing] = useState(false)
  const validateRecipient = async () => {
    if (!recipientInput.trim()) {
      toast.error("Ingresa un alias o CBU")
      return
    }

    setIsValidating(true)

    try {
      const response = await fetch("/api/validate-recipient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: recipientInput.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error validating recipient")
      }

      const recipient: RecipientData = {
        identifier: data.data.identifier,
        accountType: data.data.accountType,
        holderName: data.data.holderName,
      }

      setTransactionData(prev => ({ ...prev, recipient }))
      setCurrentStep("amount")
      toast.success(`${recipient.accountType === "alias" ? "Alias" : "CBU"} validado correctamente`)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "No se pudo validar el destinatario"
      toast.error(errorMessage)
    } finally {
      setIsValidating(false)
    }
  }

  const proceedToConfirmation = () => {
    const numAmount = parseFloat(amount)
    const selectedCard = cards.find(card => card.id === selectedCardId)

    if (!numAmount || numAmount <= 0) {
      toast.error("Ingresa un monto válido")
      return
    }

    if (!selectedCard) {
      toast.error("Selecciona una tarjeta")
      return
    }

    if (numAmount > Number(selectedCard.balance)) {
      toast.error("Saldo insuficiente")
      return
    }

    setTransactionData(prev => ({
      ...prev,
      amount: numAmount,
      currency: selectedCurrency,
      selectedCard
    }))
    setCurrentStep("confirmation")
  }

  const confirmTransaction = async () => {
    setIsProcessing(true)

    try {
      const response = await fetch("/api/send-money", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientIdentifier: transactionData.recipient!.identifier,
          recipientAccountType: transactionData.recipient!.accountType,
          amount: transactionData.amount!,
          currency: transactionData.currency!,
          cardId: transactionData.selectedCard!.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error processing transaction")
      }

      playSuccessSound()

      // Small delay to let the audio start before UI changes
      setTimeout(() => {
        setCurrentStep("success")
        toast.success("Transferencia realizada exitosamente")
      }, 300)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al procesar la transferencia"
      toast.error(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  const resetForm = () => {
    setCurrentStep("recipient")
    setTransactionData({})
    setRecipientInput("")
    setAmount("")
    setSelectedCardId(null)
  }

  const goBack = () => {
    switch (currentStep) {
      case "amount":
        setCurrentStep("recipient")
        break
      case "confirmation":
        setCurrentStep("amount")
        break
      default:
        router.back()
    }
  }

  const availableCards = cards.filter(card => card.currency === selectedCurrency)

  return (
    <main className="mx-auto pb-4 min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <header className="flex items-center justify-between px-6 py-4">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            Volver
          </button>
          <h1 className="text-lg font-semibold">Enviar dinero</h1>
          <div className="w-8" />
        </header>

        {/* Progress indicator */}
        <div className="px-6 pb-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span className={currentStep === "recipient" ? "text-primary font-medium" : ""}>
              Destinatario
            </span>
            <span className={currentStep === "amount" ? "text-primary font-medium" : ""}>
              Monto
            </span>
            <span className={["confirmation", "success"].includes(currentStep) ? "text-primary font-medium" : ""}>
              Confirmar
            </span>
          </div>
          <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{
                width: currentStep === "recipient" ? "33%" :
                  currentStep === "amount" ? "66%" : "100%"
              }}
            />
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Step 1: Recipient */}
        {currentStep === "recipient" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">¿A quién le querés enviar?</h2>
              <p className="text-gray-600 text-sm">
                Ingresá el alias o CBU del destinatario
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Alias o CBU
                </label>
                <Input
                  value={recipientInput}
                  onChange={(e) => setRecipientInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isValidating && recipientInput.trim()) {
                      validateRecipient()
                    }
                  }}
                  placeholder="ej: juan.perez o 0000003100010075622001"
                  className="text-base"
                  disabled={isValidating}
                />
                <p className="text-xs text-gray-500 mt-1">
                  El alias tiene formato usuario.banco. El CBU son 22 dígitos.
                </p>
              </div>

              <Button
                onClick={validateRecipient}
                disabled={isValidating || !recipientInput.trim()}
                className="w-full h-12"
              >
                {isValidating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Validando...
                  </>
                ) : (
                  "Continuar"
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Amount */}
        {currentStep === "amount" && transactionData.recipient && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">¿Cuánto querés enviar?</h2>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-800">
                    Destinatario: {transactionData.recipient.holderName}
                  </span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  {transactionData.recipient.accountType.toUpperCase()}: {transactionData.recipient.identifier}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Moneda</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.values(Currency).map((currency) => (
                    <button
                      key={currency}
                      onClick={() => {
                        setSelectedCurrency(currency)
                        setSelectedCardId(null)
                      }}
                      className={`p-3 rounded-lg border transition-all ${selectedCurrency === currency
                        ? "border-primary bg-primary/5 text-primary font-medium"
                        : "border-gray-200 hover:border-gray-300"
                        }`}
                    >
                      {currency}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Monto</label>
                <div className="relative">
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      const value = e.target.value
                      // Only allow positive numbers
                      if (value === "" || (parseFloat(value) >= 0)) {
                        setAmount(value)
                      }
                    }}
                    placeholder="0.00"
                    className="text-lg pr-12 py-6"
                    step="0.01"
                    min="0"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    {selectedCurrency}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Seleccioná desde que tarjeta vas a hacer la transferencia</label>
                {cardsLoading ? (
                  <div className="p-4 text-center text-gray-500">Cargando tarjetas...</div>
                ) : availableCards.length === 0 ? (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm text-yellow-800">
                        No tenés tarjetas en {selectedCurrency}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {availableCards.map((card) => (
                      <div
                        key={card.id}
                        onClick={() => setSelectedCardId(card.id)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedCardId === card.id
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{card.name}</p>
                            <p className="text-sm text-gray-500">
                              **** {card.lastDigits} • {card.issuer}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{Number(card.balance).toLocaleString()}</p>
                            <p className="text-sm text-gray-500">{card.currency}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button
                onClick={proceedToConfirmation}
                disabled={!amount || !selectedCardId || availableCards.length === 0}
                className="w-full h-12"
              >
                Continuar
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {currentStep === "confirmation" && transactionData.recipient && transactionData.selectedCard && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Confirmá la transferencia</h2>

              <div className="bg-white border rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Destinatario</span>
                  <span className="font-medium">{transactionData.recipient.holderName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {transactionData.recipient.accountType.toUpperCase()}
                  </span>
                  <span className="font-medium">{transactionData.recipient.identifier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monto</span>
                  <span className="font-medium text-lg">
                    {transactionData.amount?.toLocaleString()} {transactionData.currency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Desde</span>
                  <span className="font-medium">
                    {transactionData.selectedCard.name} **** {transactionData.selectedCard.lastDigits}
                  </span>
                </div>
              </div>
            </div>

            <Button className="py-6 mx-auto w-fit flex" onClick={confirmTransaction} disabled={isProcessing}>
              {isProcessing ? "Confirmando..." : "Confirmar transferencia"}
            </Button>
          </div>
        )}

        {/* Step 4: Success */}
        {currentStep === "success" && (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">¡Transferencia exitosa!</h2>
              <p className="text-gray-600">
                Se enviaron {transactionData.amount?.toLocaleString()} {transactionData.currency} a{" "}
                {transactionData.recipient?.holderName}
              </p>
            </div>

            <div className="space-y-2">
              <Button
                onClick={() => router.push("/movements")}
                className="w-full h-12"
              >
                Ver movimientos
              </Button>
              <Button
                onClick={resetForm}
                variant="outline"
                className="w-full h-12"
              >
                Enviar más dinero
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
