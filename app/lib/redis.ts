import { createClient } from 'redis';

let redisClient: ReturnType<typeof createClient> | null = null;

function getClient() {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.AZURE_REDIS_CONNECTIONSTRING || 'Redis error.'
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error', err);
      redisClient = null;
    });

    redisClient.connect().catch((err) => {
      console.error('Redis Connection Error', err);
      redisClient = null;
    });
  }
  return redisClient;
}

export async function cacheData(key: string, data: any, ttl: number = 3600) {
  const client = getClient();
  if (!client) return;

  try {
    await client.set(key, JSON.stringify(data), {
      EX: ttl
    });
  } catch (error) {
    console.error('Cache Set Error', error);
  }
}

export async function getCachedData(key: string) {
  const client = getClient();
  if (!client) return null;

  try {
    const cachedData = await client.get(key);
    return cachedData ? JSON.parse(cachedData) : null;
  } catch (error) {
    console.error('Cache Get Error', error);
    return null;
  }
}

export { getClient as redisClient };