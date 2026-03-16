import { RedisClient } from "bun";
import type { Message } from "./types";

const redis = new RedisClient();

export async function redisHealthCheck() {
  try {
    await redis.set("another-key", "another-value");
    console.log("Redis is healthy.");
  } catch (error) {
    console.error("Redis operation failed:", error);
    throw error;
  }
}

export const getSessionMessages = async (
  sessionId: string
): Promise<Message[] | null> => {
  const res = await redis.get(sessionId);

  if (res != null) {
    return JSON.parse(res);
  }
  return null;
};

export const setSessionMessages = async (
  sessionId: string,
  messages: Message[]
): Promise<"OK"> => {
  const value = JSON.stringify(messages);
  return await redis.set(sessionId, value, "EX", 60 * 60);
};
