/*
  Warnings:

  - You are about to alter the column `amount` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `orders` MODIFY `amount` DOUBLE NOT NULL;
