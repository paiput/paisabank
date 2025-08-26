import { Issuer, Currency } from "@prisma/client"

export interface CardCreateData {
  cardNumber: string
  expirationDate: string
  cvv: string
  name: string
  issuer: Issuer
  balance: number
  currency: Currency
  userId: number
}

export interface CardResponse {
  id: number
  issuer: Issuer
  name: string
  expDate: string
  lastDigits: number
  balance: number
  currency: Currency
  createdAt: Date
  updatedAt: Date
}

export interface CreateCardRequest {
  cardNumber: string
  expirationDate: string
  cvv: string
  name: string
  issuer: Issuer
  balance?: number
  currency?: Currency
}
