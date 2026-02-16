import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`;

// In-memory fallback for when Redis is not available
const memoryStore = new Map();

let client;
let useMemoryFallback = false;

try {
  client = createClient({ url: redisUrl });
  
  client.on('connect', () => {
    console.log('✅ Connected to Redis');
  });
  
  client.on('error', (err) => {
    console.error('❌ Redis error:', err);
  });
  
  await client.connect();
} catch (err) {
  console.log('⚠️ Redis not available, using in-memory storage');
  console.log('💾 In-memory storage mode - data will be lost on restart');
  useMemoryFallback = true;
  client = {
    set: async (key, value) => {
      memoryStore.set(key, value);
    },
    get: async (key) => {
      return memoryStore.get(key) || null;
    }
  };
}

export const saveUrl = async (code, url) => {
  await client.set(code, JSON.stringify({ originalUrl: url }));
};

export const getUrlByCode = async (code) => {
  const data = await client.get(code);
  if (!data) return null;
  const parsed = JSON.parse(data);
  return parsed.originalUrl;
};
