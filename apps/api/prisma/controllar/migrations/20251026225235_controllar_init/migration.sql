-- CreateEnum
CREATE TYPE "controllar"."AccountType" AS ENUM ('WALLET', 'BANK', 'CREDIT_CARD', 'INTEGRATION');

-- CreateEnum
CREATE TYPE "controllar"."TxType" AS ENUM ('income', 'expense', 'transfer');

-- CreateEnum
CREATE TYPE "controllar"."Source" AS ENUM ('MANUAL', 'KMONE');

-- CreateTable
CREATE TABLE "controllar"."Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "controllar"."AccountType" NOT NULL,
    "name" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'BRL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "controllar"."Transaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "type" "controllar"."TxType" NOT NULL,
    "amountMinor" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "categoryId" TEXT,
    "description" TEXT,
    "source" "controllar"."Source" NOT NULL DEFAULT 'MANUAL',
    "externalRef" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "controllar"."BudgetMonth" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'BRL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BudgetMonth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "controllar"."BudgetItem" (
    "id" TEXT NOT NULL,
    "budgetMonthId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "limitMinor" INTEGER NOT NULL,

    CONSTRAINT "BudgetItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "controllar"."Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_externalRef_key" ON "controllar"."Transaction"("externalRef");

-- CreateIndex
CREATE INDEX "Transaction_userId_idx" ON "controllar"."Transaction"("userId");

-- CreateIndex
CREATE INDEX "Transaction_date_idx" ON "controllar"."Transaction"("date");

-- CreateIndex
CREATE INDEX "BudgetMonth_month_idx" ON "controllar"."BudgetMonth"("month");

-- CreateIndex
CREATE INDEX "BudgetMonth_userId_idx" ON "controllar"."BudgetMonth"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BudgetMonth_userId_month_key" ON "controllar"."BudgetMonth"("userId", "month");

-- CreateIndex
CREATE UNIQUE INDEX "BudgetItem_budgetMonthId_categoryId_key" ON "controllar"."BudgetItem"("budgetMonthId", "categoryId");

-- AddForeignKey
ALTER TABLE "controllar"."Transaction" ADD CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "controllar"."Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "controllar"."BudgetItem" ADD CONSTRAINT "BudgetItem_budgetMonthId_fkey" FOREIGN KEY ("budgetMonthId") REFERENCES "controllar"."BudgetMonth"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
