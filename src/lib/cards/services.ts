import { CreateCardRequest } from "@/lib/cards/types"
import { Issuer, Currency } from "@prisma/client"
import { prisma } from "@/prisma/client"

export async function getUserCards(userId: number) {
  return await prisma.card.findMany({
    where: {
      userId,
    },
  })
}

export async function validateCardData(
  cardData: CreateCardRequest,
): Promise<void> {
  const errors: string[] = []

  // Validate card number
  if (!isValidCardNumber(cardData.cardNumber)) {
    errors.push("Invalid card number format")
  }

  // Validate expiration date
  if (!isValidExpirationDate(cardData.expirationDate)) {
    errors.push("Invalid expiration date format (MM/YY)")
  }

  // Validate CVV
  if (!isValidCVV(cardData.cvv)) {
    errors.push("Invalid CVV format")
  }

  // Validate name
  if (!cardData.name || cardData.name.trim().length < 2) {
    errors.push("Card name must be at least 2 characters long")
  }

  // Validate issuer
  if (!Object.values(Issuer).includes(cardData.issuer)) {
    errors.push("Invalid card issuer")
  }

  // Validate balance if provided
  if (cardData.balance !== undefined && cardData.balance < 0) {
    errors.push("Balance cannot be negative")
  }

  // Validate currency if provided
  if (
    cardData.currency &&
    !Object.values(Currency).includes(cardData.currency)
  ) {
    errors.push("Invalid currency")
  }

  if (errors.length > 0) {
    throw new Error(`Validation failed: ${errors.join(", ")}`)
  }
}

function isValidCardNumber(cardNumber: string): boolean {
  const cleanNumber = cardNumber.replace(/\s|-/g, "")
  return /^\d{13,19}$/.test(cleanNumber) && luhnCheck(cleanNumber)
}

function isValidExpirationDate(expDate: string): boolean {
  const regex = /^(0[1-9]|1[0-2])\/\d{2}$/
  if (!regex.test(expDate)) return false

  const [month, year] = expDate.split("/").map(Number)
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear() % 100
  const currentMonth = currentDate.getMonth() + 1

  // Check if card is not expired
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return false
  }

  return true
}

function isValidCVV(cvv: string): boolean {
  return /^\d{3,4}$/.test(cvv)
}

function luhnCheck(cardNumber: string): boolean {
  let sum = 0
  let alternate = false

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let n = parseInt(cardNumber.charAt(i), 10)

    if (alternate) {
      n *= 2
      if (n > 9) {
        n = (n % 10) + 1
      }
    }

    sum += n
    alternate = !alternate
  }

  return sum % 10 === 0
}
