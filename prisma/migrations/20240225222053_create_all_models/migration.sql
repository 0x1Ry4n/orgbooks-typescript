-- CreateEnum
CREATE TYPE "PermissionFlags" AS ENUM ('customer:create', 'customer:edit', 'customer:delete', 'customer:list', 'bookstore:create', 'bookstore:edit', 'bookstore:delete', 'bookstore:list', 'book:create', 'book:edit', 'book:delete', 'book:list', 'bookloan:create', 'bookloan:edit', 'bookloan:delete', 'bookloan:list', 'review:create', 'review:edit', 'review:delete', 'review:list', 'comment:create', 'comment:edit', 'comment:delete', 'comment:list');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('ADMIN', 'CUSTOMER');

-- CreateTable
CREATE TABLE "AuthData" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "passwordRecoverCode" TEXT,
    "passwordRecoverExpiration" TIMESTAMP(3),
    "userType" "UserType" NOT NULL,
    "permissions" "PermissionFlags"[],

    CONSTRAINT "AuthData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "authDataId" TEXT NOT NULL,
    "username" VARCHAR(20) NOT NULL,
    "phoneNumber" VARCHAR(15) NOT NULL,
    "birthDate" DATE,
    "imageLocation" TEXT,
    "bookstoreId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "authDataId" TEXT NOT NULL,
    "username" VARCHAR(20) NOT NULL,
    "phoneNumber" VARCHAR(15) NOT NULL,
    "birthDate" DATE,
    "imageLocation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookstores" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" VARCHAR(15) NOT NULL,
    "city" TEXT NOT NULL,
    "cep" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookstores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookloans" (
    "id" TEXT NOT NULL,
    "bookstoreId" TEXT,
    "bookId" TEXT,
    "customerId" TEXT,
    "returnDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookloans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "books" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "publicationDate" TIMESTAMP(3),
    "author" VARCHAR(255),
    "genre" VARCHAR(50),
    "qrCodeId" VARCHAR(50),
    "price" DOUBLE PRECISION,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "bookstoreId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "customerId" TEXT,
    "bookId" TEXT,
    "title" VARCHAR(200) NOT NULL,
    "body" VARCHAR(2000) NOT NULL,
    "imageLocation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" SERIAL NOT NULL,
    "customerId" TEXT,
    "reviewId" TEXT,
    "body" VARCHAR(300) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sid" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthData_email_key" ON "AuthData"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admins_authDataId_key" ON "admins"("authDataId");

-- CreateIndex
CREATE UNIQUE INDEX "customers_authDataId_key" ON "customers"("authDataId");

-- CreateIndex
CREATE UNIQUE INDEX "bookstores_email_key" ON "bookstores"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sid_key" ON "Session"("sid");

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_authDataId_fkey" FOREIGN KEY ("authDataId") REFERENCES "AuthData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_bookstoreId_fkey" FOREIGN KEY ("bookstoreId") REFERENCES "bookstores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_authDataId_fkey" FOREIGN KEY ("authDataId") REFERENCES "AuthData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookloans" ADD CONSTRAINT "bookloans_bookstoreId_fkey" FOREIGN KEY ("bookstoreId") REFERENCES "bookstores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookloans" ADD CONSTRAINT "bookloans_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookloans" ADD CONSTRAINT "bookloans_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "books" ADD CONSTRAINT "books_bookstoreId_fkey" FOREIGN KEY ("bookstoreId") REFERENCES "bookstores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "reviews"("id") ON DELETE SET NULL ON UPDATE CASCADE;
