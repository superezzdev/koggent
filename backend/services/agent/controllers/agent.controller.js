import axios from "axios";
import { graph } from "../graph/graph.js";
import { addMessage } from "../config/memory.js";
import redis from "../../../shared/redis/redis.js";

export const agent = async (req, res) => {
  try {
    const { prompt, conversationId, agent } = req.body;
    const userId =
      req.headers["x-user-id"] ||
      req.user?._id?.toString() ||
      req.user?.userId;

    try {
      await redis.del(`messages-${conversationId}`);
    } catch (e) {
      console.warn("Redis memory cache invalidation error:", e.message);
    }

    try {
      await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
        conversationId,
        role: "user",
        content: prompt,
      });
    } catch (saveUserErr) {
      console.warn("Failed to persist user message in chat service:", saveUserErr.message);
    }

    const result = await graph.invoke({
      prompt,
      conversationId,
      agent,
      userId,
    });

    const response = result.aiResponse;

    await addMessage(conversationId, "user", prompt);
    await addMessage(conversationId, "assistant", response);

    try {
      await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
        conversationId,
        role: "assistant",
        content: result.aiResponse,
        images: result.images || [],
        artifacts: result.artifacts || [],
      });
    } catch (saveAssistantErr) {
      console.warn("Failed to persist assistant response in chat service:", saveAssistantErr.message);
    }

    return res.status(200).json({
      answer: result.aiResponse,
      images: result.images,
      artifacts: result.artifacts,
      credits: result.credits,
    });
  } catch (error) {
    console.error("agent controller error:", error);
    return res.status(500).json({
      message: `agent error ${error.message || error}`,
    });
  }
};