import { PrismaClient } from '@prisma/client';
import { config } from './env';

// Prisma Client singleton
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: config.isDevelopment ? ['query', 'error', 'warn'] : ['error'],
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

if (config.isDevelopment) globalThis.prisma = prisma;

export default prisma;
