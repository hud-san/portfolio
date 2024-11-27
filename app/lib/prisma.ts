import { PrismaClient } from '@prisma/client';
import { cacheData, getCachedData } from '~/lib/redis';

let prisma: PrismaClient;

declare global {
  var __db: PrismaClient | undefined;
}

// Initialize PrismaClient
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.__db) {
    global.__db = new PrismaClient();
  }
  prisma = global.__db;
}

// Enhanced cache wrapper with error handling and logging
const cacheWrapper = async <T>(
  key: string,
  operation: () => Promise<T>,
  ttl: number = 3600
): Promise<T> => {
  try {
    const cachedData = await getCachedData(key);
    if (cachedData) {
      console.log(`Cache hit for key: ${key}`);
      return cachedData as T;
    }

    console.log(`Cache miss for key: ${key}`);
    const data = await operation();
    await cacheData(key, data, ttl);
    console.log(`Data cached for key: ${key}`);
    return data;
  } catch (error) {
    console.error(`Cache operation failed for key ${key}:`, error);
    // Fallback to direct database query if caching fails
    return operation();
  }
};

// Helper function to create cached versions of Prisma methods
const createCachedMethod = <T extends (...args: any[]) => Promise<any>>(
  method: T,
  modelName: string,
  operationName: string
) => {
  return (...args: Parameters<T>): ReturnType<T> => {
    const key = `${modelName}:${operationName}:${JSON.stringify(args)}`;
    return cacheWrapper(key, () => method(...args)) as ReturnType<T>;
  };
};

// Create a type-safe proxy for Prisma client
export const db = new Proxy(prisma, {
  get(target, prop) {
    if (typeof prop === 'string' && prop in target) {
      const model = target[prop as keyof typeof target];
      if (typeof model === 'object' && model !== null) {
        return new Proxy(model, {
          get(modelTarget, modelProp) {
            if (modelProp === 'findUnique' || modelProp === 'findMany') {
              return createCachedMethod(
                modelTarget[modelProp as keyof typeof modelTarget] as any,
                prop,
                modelProp as string
              );
            }
            return modelTarget[modelProp as keyof typeof modelTarget];
          },
        });
      }
    }
    return target[prop as keyof typeof target];
  },
}) as PrismaClient;

export type DB = typeof db;

// Error handling for Prisma
prisma.$use(async (params, next) => {
  try {
    return await next(params);
  } catch (error) {
    console.error(`Prisma error in ${params.model}.${params.action}:`, error);
    throw error;
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});