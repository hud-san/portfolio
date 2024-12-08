import { PrismaClient } from '@prisma/client';
import { cacheData, getCachedData } from '~/lib/redis';

let prisma: PrismaClient;

declare global {
  var __db: PrismaClient | undefined;
}

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.__db) {
    global.__db = new PrismaClient();
  }
  prisma = global.__db;
}

const cacheWrapper = async <T>(
  key: string,
  operation: () => Promise<T>,
  ttl: number = 3600
): Promise<T> => {
  const cachedData = await getCachedData(key);
  if (cachedData) {
    return cachedData as T;
  }

  const data = await operation();
  await cacheData(key, data, ttl);
  return data;
};

export const db = {
  ...prisma,
  post: {
    ...prisma.post,
    findUnique: (args: Parameters<typeof prisma.post.findUnique>[0]) =>
      cacheWrapper(`post:${JSON.stringify(args)}`, () => prisma.post.findUnique(args)),
    findMany: (args: Parameters<typeof prisma.post.findMany>[0]) =>
      cacheWrapper(`posts:${JSON.stringify(args)}`, () => prisma.post.findMany(args)),
  },
  experience: {
    ...prisma.experience,
    findUnique: (args: Parameters<typeof prisma.experience.findUnique>[0]) =>
      cacheWrapper(`experience:${JSON.stringify(args)}`, () => prisma.experience.findUnique(args)),
    findMany: (args: Parameters<typeof prisma.experience.findMany>[0]) =>
      cacheWrapper(`experiences:${JSON.stringify(args)}`, () => prisma.experience.findMany(args)),
  },
  education: {
    ...prisma.education,
    findUnique: (args: Parameters<typeof prisma.education.findUnique>[0]) =>
      cacheWrapper(`education:${JSON.stringify(args)}`, () => prisma.education.findUnique(args)),
    findMany: (args: Parameters<typeof prisma.education.findMany>[0]) =>
      cacheWrapper(`educations:${JSON.stringify(args)}`, () => prisma.education.findMany(args)),
  },
};

export type DB = typeof db;