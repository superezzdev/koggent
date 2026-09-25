import redis from "../../../shared/redis/redis.js";

const Limits = {
  chat: 20,
  coding: 5,
  pdf: 5,
  pdfRag: 5,
  ppt: 5,
  image: 5,
  vision: 5,
  imageAnalyzer: 5,
  search: 5,
};

export const checkAgentLimit = async (userId, agent) => {
  const max = Limits[agent] || Limits["chat"];
  const safeUserId = userId || "anonymous";
  const key = `rate:${safeUserId}:${agent}`;

  try {
    const count = await redis.incr(key);

    if (count === 1) {
      await redis.expire(key, 60);
    }

    let ttl = await redis.ttl(key);
    if (ttl < 0) {
      await redis.expire(key, 60);
      ttl = 60;
    }

    if (count > max) {
      const minutes = Math.floor(ttl / 60);
      const seconds = ttl % 60;

      const time = minutes > 0 ? `${minutes}m : ${seconds}s` : `${seconds}s`;

      const error = new Error(`Rate limit exceeded for ${agent}.`);
      error.status = 429;

      error.data = {
        success: false,
        agent,
        limit: max,
        remainingTime: ttl,
        retryAfter: time,
        message: `You have reached the ${agent} limit (${max} requests/minute). Try again in ${time}.`,
      };

      throw error;
    }

    return {
      remaining: max - count,
      limit: max,
      ttl: ttl,
    };
  } catch (error) {
    if (error.status === 429) {
      throw error;
    }
    console.warn("Redis rate limit check warning:", error.message);
    return {
      remaining: max,
      limit: max,
      ttl: 60,
    };
  }
};

export const chatAgentLimit = checkAgentLimit;
