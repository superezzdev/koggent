import redis from "../../../shared/redis/redis.js";
import { getMessages } from "../utils/getMessages.js";

export const getMemory = async (conversationId) => {
  const key = `messages-${conversationId}`;

  try {
    const cached = await redis.get(key);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.error("Failed to parse cached memory:", error.message);
  }

  const messages = (await getMessages(conversationId)) || [];

  if (Array.isArray(messages) && messages.length > 0) {
    await redis.set(key, JSON.stringify(messages), "EX", 24 * 60 * 60);
  }

  return messages;
};

export const addMessage = async (conversationId, role, content) => {
  const key = `messages-${conversationId}`;

  const rawMessages = await redis.get(key);

  const messages = rawMessages ? JSON.parse(rawMessages) : [];

  messages.push({
    role,
    content,
  });

  if (messages.length > 20) {
    messages.shift();
  }

  await redis.set(key, JSON.stringify(messages));
};