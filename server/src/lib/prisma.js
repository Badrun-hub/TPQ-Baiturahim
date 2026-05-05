import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing in .env file!");
}

// Inisialisasi adapter dengan konfigurasi (bukan instance client)
const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const prisma = new PrismaClient({ adapter });

export default prisma;
