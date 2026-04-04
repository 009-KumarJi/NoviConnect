import { Redis } from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redisURI = process.env.REDIS_URI || "redis://127.0.0.1:6379";

export const redis = new Redis(redisURI);

redis.on("connect", () => {
  console.log("Connected to Redis gracefully.");
});

redis.on("error", (err) => {
  console.error("Redis connection error: ", err);
});
