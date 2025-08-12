-- CreateEnum
CREATE TYPE "public"."Issuer" AS ENUM ('VISA', 'MASTERCARD');

-- CreateEnum
CREATE TYPE "public"."Currency" AS ENUM ('ARS', 'USD', 'EUR');

-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('SUS', 'CASH_IN', 'CASH_OUT');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Card" (
    "id" SERIAL NOT NULL,
    "issuer" "public"."Issuer" NOT NULL,
    "name" TEXT NOT NULL,
    "expDate" TEXT NOT NULL,
    "lastDigits" SMALLINT NOT NULL,
    "balance" DECIMAL(65,30) NOT NULL,
    "currency" "public"."Currency" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Transaction" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" "public"."Currency" NOT NULL,
    "type" "public"."TransactionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cardId" INTEGER NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."Card" ADD CONSTRAINT "Card_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "public"."Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
