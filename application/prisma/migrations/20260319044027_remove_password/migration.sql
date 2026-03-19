/*
  Warnings:

  - You are about to drop the column `password` on the `Student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "password",
ADD COLUMN     "image" TEXT,
ALTER COLUMN "name" DROP NOT NULL;
