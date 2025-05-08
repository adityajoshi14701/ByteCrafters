import { PrismaClient } from "../generated/prisma/index.js";

// this line is used to prevent the PrismaClient from being instantiated multiple times in development mode. when hot reloading, otherwise we would get this error: Error: The PrismaClient instance was already instatiated.
const globalForPrisma = globalThis;

export const db = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
