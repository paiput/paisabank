"use client"

import { useState } from "react"
import { Button } from "@/lib/layout/components/ui/button"
import { Input } from "@/lib/layout/components/ui/input"
import { Label } from "@/lib/layout/components/ui/label"
import { CreateCardRequest } from "@/lib/cards/types"
import { Issuer, Currency } from "@/generated/prisma"

interface AddCardFormProps {
  onSubmit: (cardData: CreateCardRequest) => Promise<void>
  loading?: boolean
}

export function AddCardForm({ onSubmit, loading = false }: AddCardFormProps) {
  const [formData, setFormData] = useState<CreateCardRequest>({
    cardNumber: "",
    expirationDate: "",
    cvv: "",
    name: "",
    issuer: Issuer.VISA,
    balance: 0,
    currency: Currency.USD,
  })

  const [errors, setErrors] = useState<Partial<CreateCardRequest>>({})

  const handleChange = (
    field: keyof CreateCardRequest,
    value: string | number,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateCardRequest> = {}

    if (!formData.cardNumber || formData.cardNumber.length < 13) {
      newErrors.cardNumber = "Valid card number is required"
    }

    if (
      !formData.expirationDate ||
      !/^\d{2}\/\d{2}$/.test(formData.expirationDate)
    ) {
      newErrors.expirationDate = "Valid expiration date (MM/YY) is required"
    }

    if (!formData.cvv || !/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = "Valid CVV is required"
    }

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = "Card name is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await onSubmit(formData)
      setFormData({
        cardNumber: "",
        expirationDate: "",
        cvv: "",
        name: "",
        issuer: Issuer.VISA,
        balance: 0,
        currency: Currency.USD,
      })
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpirationDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? "/" + v.substring(2, 4) : "")
    }
    return v
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="cardNumber">Card Number</Label>
        <Input
          id="cardNumber"
          type="text"
          placeholder="1234 5678 9012 3456"
          maxLength={19}
          value={formatCardNumber(formData.cardNumber)}
          onChange={(e) =>
            handleChange("cardNumber", e.target.value.replace(/\s/g, ""))
          }
          className={errors.cardNumber ? "border-red-500" : ""}
        />
        {errors.cardNumber && (
          <p className="mt-1 text-sm text-red-500">{errors.cardNumber}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="expirationDate">Expiration Date</Label>
          <Input
            id="expirationDate"
            type="text"
            placeholder="MM/YY"
            maxLength={5}
            value={formatExpirationDate(formData.expirationDate)}
            onChange={(e) =>
              handleChange(
                "expirationDate",
                e.target.value.replace(/[^0-9\/]/g, ""),
              )
            }
            className={errors.expirationDate ? "border-red-500" : ""}
          />
          {errors.expirationDate && (
            <p className="mt-1 text-sm text-red-500">{errors.expirationDate}</p>
          )}
        </div>

        <div>
          <Label htmlFor="cvv">CVV</Label>
          <Input
            id="cvv"
            type="text"
            placeholder="123"
            maxLength={4}
            value={formData.cvv}
            onChange={(e) =>
              handleChange("cvv", e.target.value.replace(/[^0-9]/g, ""))
            }
            className={errors.cvv ? "border-red-500" : ""}
          />
          {errors.cvv && (
            <p className="mt-1 text-sm text-red-500">{errors.cvv}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="name">Cardholder Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="John Doe"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="issuer">Card Issuer</Label>
          <select
            id="issuer"
            value={formData.issuer}
            onChange={(e) => handleChange("issuer", e.target.value as Issuer)}
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value={Issuer.VISA}>Visa</option>
            <option value={Issuer.MASTERCARD}>Mastercard</option>
          </select>
        </div>

        <div>
          <Label htmlFor="currency">Currency</Label>
          <select
            id="currency"
            value={formData.currency}
            onChange={(e) =>
              handleChange("currency", e.target.value as Currency)
            }
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value={Currency.USD}>USD</option>
            <option value={Currency.EUR}>EUR</option>
            <option value={Currency.ARS}>ARS</option>
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="balance">Initial Balance</Label>
        <Input
          id="balance"
          type="number"
          placeholder="0.00"
          min="0"
          step="0.01"
          value={formData.balance}
          onChange={(e) =>
            handleChange("balance", parseFloat(e.target.value) || 0)
          }
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Adding Card..." : "Add Card"}
      </Button>
    </form>
  )
}
