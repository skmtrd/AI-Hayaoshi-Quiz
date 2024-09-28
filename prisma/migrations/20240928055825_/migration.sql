/*
  Warnings:

  - Added the required column `correctCount` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Result_roomId_key";

-- AlterTable
ALTER TABLE "Result" ADD COLUMN     "correctCount" INTEGER NOT NULL;
