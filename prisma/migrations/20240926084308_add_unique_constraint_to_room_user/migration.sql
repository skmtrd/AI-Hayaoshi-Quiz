/*
  Warnings:

  - You are about to drop the column `anserTimeLimit` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the `_RoomToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ownerId` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `theme` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `types` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_RoomToUser" DROP CONSTRAINT "_RoomToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_RoomToUser" DROP CONSTRAINT "_RoomToUser_B_fkey";

-- DropIndex
DROP INDEX "Room_name_idx";

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "incorrectAnswers" TEXT[];

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "anserTimeLimit",
DROP COLUMN "category",
DROP COLUMN "name",
ADD COLUMN     "answerTimeLimit" INTEGER,
ADD COLUMN     "maxPlayer" INTEGER,
ADD COLUMN     "numberOfUser" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ownerId" TEXT NOT NULL,
ADD COLUMN     "theme" TEXT NOT NULL,
ADD COLUMN     "types" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'WAITING';

-- DropTable
DROP TABLE "_RoomToUser";

-- CreateTable
CREATE TABLE "RoomUser" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isHost" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoomUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RoomUser_userId_roomId_key" ON "RoomUser"("userId", "roomId");

-- CreateIndex
CREATE INDEX "Room_theme_idx" ON "Room"("theme");

-- AddForeignKey
ALTER TABLE "RoomUser" ADD CONSTRAINT "RoomUser_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomUser" ADD CONSTRAINT "RoomUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
