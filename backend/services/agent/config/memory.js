import redis from "../../../shared/redis/redis.js";
import { getMessages } from "../utils/getMessages.js";

export const getMemory = async (conversationId) => {
  const key = `messages-${conversationId}`;

  try {
    const cached = await redis.get(key);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // Ignored; falls back to database messages
      }
    }
  } catch (error) {
    console.error("Failed to retrieve cached memory:", error.message);
  }

  const messages = (await getMessages(conversationId)) || [];

  if (Array.isArray(messages) && messages.length > 0) {
    try {
      await redis.set(key, JSON.stringify(messages), "EX", 24 * 60 * 60);
    } catch (e) {
      console.error("Failed to cache memory in redis:", e.message);
    }
  }

  return messages;
};

export const addMessage = async (conversationId, role, content) => {
  const key = `messages-${conversationId}`;

  try {
    const rawMessages = await redis.get(key);
    let messages = [];

    if (rawMessages) {
      try {
        const parsed = JSON.parse(rawMessages);
        if (Array.isArray(parsed)) messages = parsed;
      } catch {
        messages = [];
      }
    }

    messages.push({
      role,
      content,
    });

    if (messages.length > 20) {
      messages.shift();
    }

    await redis.set(key, JSON.stringify(messages), "EX", 24 * 60 * 60);
  } catch (error) {
    console.error("Failed to add message to memory:", error.message);
  }
};