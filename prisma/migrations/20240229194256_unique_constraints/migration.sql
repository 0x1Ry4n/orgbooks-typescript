/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `bookstores` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `customers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "bookstores_name_key" ON "bookstores"("name");

-- CreateIndex
CREATE UNIQUE INDEX "customers_username_key" ON "customers"("username");
