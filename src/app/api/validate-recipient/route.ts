import { NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth/api-middleware"
import { z } from "zod"

const validateRecipientSchema = z.object({
  identifier: z.string().min(1),
})

const mockRecipients = [
  { identifier: "juan.perez", type: "alias", name: "Juan Pérez" },
  { identifier: "maria.lopez", type: "alias", name: "María López" },
  { identifier: "carlos.rodriguez", type: "alias", name: "Carlos Rodríguez" },
  { identifier: "ana.martinez", type: "alias", name: "Ana Martínez" },
  { identifier: "0000003100010075622001", type: "cbu", name: "Juan Pérez" },
  { identifier: "0000003100010075622002", type: "cbu", name: "María González" },
  { identifier: "0000003100010075622003", type: "cbu", name: "Pedro Sánchez" },
  { identifier: "test.user", type: "alias", name: "Usuario Test" },
]

export const POST = withAuth(async (request: NextRequest, session) => {
  try {
    const body = await request.json()
    const validationResult = validateRecipientSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Invalid data", errors: validationResult.error.issues },
        { status: 400 },
      )
    }

    const { identifier } = validationResult.data

    const isNumeric = /^\d+$/.test(identifier)
    const isCBU = isNumeric && identifier.length === 22
    const isAlias = !isNumeric && identifier.includes(".")

    if (!isCBU && !isAlias) {
      return NextResponse.json(
        {
          message:
            "Formato inválido. Debe ser un alias (ej: lucas.piputto) o CBU de 22 dígitos.",
        },
        { status: 400 },
      )
    }

    const accountType = isCBU ? "cbu" : "alias"

    const recipient = mockRecipients.find(
      (r) => r.identifier.toLowerCase() === identifier.toLowerCase(),
    )

    if (!recipient) {
      return NextResponse.json(
        {
          message: `${accountType === "alias" ? "Alias" : "CBU"} no encontrado. Probá con juan.perez`,
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        identifier: recipient.identifier,
        accountType: recipient.type,
        holderName: recipient.name,
        validated: true,
      },
    })
  } catch (error) {
    console.error("Recipient validation error:", error)
    return NextResponse.json(
      { message: "Error validating recipient" },
      { status: 500 },
    )
  }
})
