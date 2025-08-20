-- CreateIndex
CREATE INDEX "Transaction_cardId_type_idx" ON "public"."Transaction"("cardId", "type");

-- CreateIndex
CREATE INDEX "Transaction_cardId_currency_idx" ON "public"."Transaction"("cardId", "currency");

-- CreateIndex
CREATE INDEX "Transaction_title_idx" ON "public"."Transaction"("title");
