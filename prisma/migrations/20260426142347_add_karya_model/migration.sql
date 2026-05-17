-- CreateTable
CREATE TABLE `Karya` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `judul` VARCHAR(191) NOT NULL,
    `deskripsi` TEXT NOT NULL,
    `link` VARCHAR(191) NULL,
    `namaPembuat` VARCHAR(191) NOT NULL,
    `kelas` VARCHAR(191) NOT NULL,
    `jurusan` VARCHAR(191) NOT NULL,
    `thumbnail` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'DITOLAK', 'DITERIMA') NOT NULL DEFAULT 'PENDING',
    `keterangan` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
