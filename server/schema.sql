-- CreateTable
CREATE TABLE "Admin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Santri" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nama" TEXT NOT NULL,
    "kelas" TEXT NOT NULL,
    "alamat" TEXT NOT NULL DEFAULT '',
    "noHp" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Absensi" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "santriId" INTEGER NOT NULL,
    "tanggal" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "Absensi_santriId_fkey" FOREIGN KEY ("santriId") REFERENCES "Santri" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Keuangan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "santriId" INTEGER NOT NULL,
    "bulan" INTEGER NOT NULL,
    "tahun" INTEGER NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "catatan" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "Keuangan_santriId_fkey" FOREIGN KEY ("santriId") REFERENCES "Santri" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Galeri" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL DEFAULT '',
    "kategori" TEXT NOT NULL DEFAULT 'Kegiatan',
    "imageUrl" TEXT NOT NULL,
    "tahun" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Prestasi" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "judul" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "lomba" TEXT NOT NULL,
    "tingkat" TEXT NOT NULL,
    "peringkat" TEXT NOT NULL,
    "tahun" INTEGER NOT NULL,
    "deskripsi" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Absensi_santriId_tanggal_key" ON "Absensi"("santriId", "tanggal");

-- CreateIndex
CREATE UNIQUE INDEX "Keuangan_santriId_bulan_tahun_key" ON "Keuangan"("santriId", "bulan", "tahun");

