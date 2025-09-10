import { PrismaClient } from "@/generated/prisma"; // مسیر به جای @/generated/prisma

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query"], // اختیاری
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
