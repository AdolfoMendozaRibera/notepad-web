/*
  Warnings:

  - You are about to drop the column `grupoId` on the `Note` table. All the data in the column will be lost.
  - Added the required column `groupId` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_grupoId_fkey";

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "grupoId",
ADD COLUMN     "groupId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
