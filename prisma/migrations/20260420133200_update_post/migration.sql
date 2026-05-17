/*
  Warnings:

  - You are about to drop the column `category` on the `post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `post` DROP COLUMN `category`,
    ADD COLUMN `thumbnail` VARCHAR(191) NULL;
