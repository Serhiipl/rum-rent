// Prisma Client helper for MongoDB
import type { PrismaClient as PrismaClientType } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClientType | undefined;
}

export async function getPrismaClient() {
  // Lazy import to keep this file tree-shakeable if Prisma isn't installed
  const { PrismaClient } = await import("@prisma/client");

  if (process.env.NODE_ENV === "development") {
    if (!global.prisma) {
      global.prisma = new PrismaClient({ log: process.env.DEBUG_PRISMA ? ["query", "error", "warn"] : ["error"] });
    }
    return global.prisma;
  }

  return new PrismaClient({ log: ["error"] });
}

