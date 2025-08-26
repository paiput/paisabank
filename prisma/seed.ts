import { faker } from "@faker-js/faker"
import { PrismaClient, Issuer, Currency, TransactionType } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

function createRandomUser() {
  return {
    email: faker.internet.email(),
    password: bcrypt.hashSync(faker.internet.password({ length: 10 }), 10),
    name: faker.person.firstName(),
    lastName: faker.person.lastName(),
  }
}

function createRandomCard(userId: number) {
  const issuer = faker.helpers.enumValue(Issuer)
  const currency = faker.helpers.enumValue(Currency)
  const balance = faker.number.float({ min: 0, max: 50000, fractionDigits: 2 })

  return {
    issuer,
    name: `${issuer} ${faker.finance.creditCardIssuer()}`,
    expDate: faker.date.future({ years: 5 }).toISOString().slice(0, 7), // YYYY-MM format
    lastDigits: faker.number.int({ min: 1000, max: 9999 }),
    balance,
    currency,
    userId,
  }
}

function createRandomTransaction(cardId: number, currency: Currency) {
  const type = faker.helpers.enumValue(TransactionType)
  const amount = faker.number.float({ min: 10, max: 5000, fractionDigits: 2 })

  let title: string
  switch (type) {
    case TransactionType.CASH_IN:
      title = faker.helpers.arrayElement([
        "Depósito de sueldo",
        "Transferencia recibida",
        "Reembolso",
        "Devolución",
        "Pago de freelance",
      ])
      break
    case TransactionType.CASH_OUT:
      title = faker.helpers.arrayElement([
        "Compra en Supermercado",
        "Pago de servicio",
        "Pago de restaurante",
        "Pago de internet",
        "Recarga SUBE",
        "Pago de educación",
        "Copago médico",
      ])
      break
    case TransactionType.SUS:
      title = faker.helpers.arrayElement([
        "Adobe",
        "Rappi plus",
        "Spotify",
        "Netflix",
      ])
      break
  }

  return {
    title,
    amount,
    currency,
    type,
    cardId,
  }
}

async function main() {
  console.log("🌱 Starting database seed...")

  // Clean up existing data
  await prisma.transaction.deleteMany()
  await prisma.card.deleteMany()
  await prisma.user.deleteMany()

  console.log("🗑️  Cleaned existing data")

  // Create users
  const users = []
  const mainUser = await prisma.user.create({
    data: {
      email: "soypaisanx@paisanos.io",
      password: bcrypt.hashSync("PAISANX2023!$", 10),
      name: "Lucas",
      lastName: "Piputto",
    },
  })
  users.push(mainUser)

  for (let i = 0; i < 5; i++) {
    const userData = createRandomUser()
    const user = await prisma.user.create({
      data: userData,
    })
    users.push(user)
  }

  console.log(`👥 Created ${users.length} users`)

  // Create cards for each user
  const cards = []
  for (const user of users) {
    const numCards = faker.number.int({ min: 1, max: 3 })
    for (let i = 0; i < numCards; i++) {
      const cardData = createRandomCard(user.id)
      const card = await prisma.card.create({
        data: cardData,
      })
      cards.push(card)
    }
  }

  console.log(`💳 Created ${cards.length} cards`)

  // Create transactions for each card
  let totalTransactions = 0
  for (const card of cards) {
    const numTransactions = faker.number.int({ min: 5, max: 20 })
    for (let i = 0; i < numTransactions; i++) {
      const transactionData = createRandomTransaction(card.id, card.currency)
      await prisma.transaction.create({
        data: transactionData,
      })
      totalTransactions++
    }
  }

  console.log(`💰 Created ${totalTransactions} transactions`)
  console.log("✅ Database seeding completed!")
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
