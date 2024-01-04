-- CreateEnum
CREATE TYPE "UserKind" AS ENUM ('NORMAL', 'ADMIN');

-- CreateEnum
CREATE TYPE "OperationType" AS ENUM ('CREATE', 'READ', 'UPDATE', 'DELETE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isSysAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDefinedRole" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "UserDefinedRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "resourceName" TEXT NOT NULL,
    "operationTypes" "OperationType"[],
    "userDefinedRoleId" TEXT,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserToUserDefinedRole" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_UserToUserDefinedRole_AB_unique" ON "_UserToUserDefinedRole"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToUserDefinedRole_B_index" ON "_UserToUserDefinedRole"("B");

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_userDefinedRoleId_fkey" FOREIGN KEY ("userDefinedRoleId") REFERENCES "UserDefinedRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToUserDefinedRole" ADD CONSTRAINT "_UserToUserDefinedRole_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToUserDefinedRole" ADD CONSTRAINT "_UserToUserDefinedRole_B_fkey" FOREIGN KEY ("B") REFERENCES "UserDefinedRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;
