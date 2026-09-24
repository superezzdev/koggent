import axios from "axios";
import fs from "fs";
import { graph } from "../graph/graph.js";
import { addMessage } from "../config/memory.js";
import redis from "../../../shared/redis/redis.js";

export const agent = async (req, res) => {
  try {
    const { prompt, conversationId, agent } = req.body;
    const file = req.file;

    const isPdf =
      file?.mimetype === "application/pdf" ||
      file?.mimetype === "application/x-pdf" ||
      file?.originalname?.toLowerCase().endsWith(".pdf");

    const resolvedPrompt =
      prompt?.trim() ||
      (file
        ? isPdf
          ? "Analyze uploaded PDF document"
          : "Analyze uploaded image"
        : "");

    const userId =
      req.headers["x-user-id"] ||
      req.user?._id?.toString() ||
      req.user?.userId;

    if (conversationId) {
      try {
        await redis.del(`messages-${conversationId}`);
      } catch (e) {
        console.warn("Redis memory cache invalidation error:", e.message);
      }

      try {
        await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
          conversationId,
          role: "user",
          content: resolvedPrompt,
        });
      } catch (saveUserErr) {
        console.warn("Failed to persist user message in chat service:", saveUserErr.message);
      }
    }

    const result = await graph.invoke({
      prompt: resolvedPrompt,
      conversationId,
      agent,
      userId,
      file, // Pass the uploaded file to the graph
    });

    const response =
      typeof result.aiResponse === "string"
        ? result.aiResponse
        : Array.isArray(result.aiResponse)
          ? result.aiResponse.map((c) => (typeof c === "string" ? c : c?.text || "")).join("\n")
          : result.aiResponse
            ? JSON.stringify(result.aiResponse)
            : "Sorry, I could not generate a response.";

    if (conversationId) {
      await addMessage(conversationId, "user", resolvedPrompt);
      await addMessage(conversationId, "assistant", response);

      try {
        await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
          conversationId,
          role: "assistant",
          content: response,
          images: result.images || [],
          artifacts: result.artifacts || [],
        });
      } catch (saveAssistantErr) {
        console.warn("Failed to persist assistant response in chat service:", saveAssistantErr.message);
      }
    }

    return res.status(200).json({
      answer: response,
      images: result.images,
      artifacts: result.artifacts,
      credits: result.credits,
    });
  } catch (error) {
    console.error("agent controller error:", error);
    return res.status(500).json({
      message: `agent error ${error.message || error}`,
    });
  } finally {
    if (file?.path && fs.existsSync(file.path)) {
      try {
        fs.unlinkSync(file.path);
      } catch (unlinkErr) {
        console.warn("Notice: Failed to unlink temp file in controller:", unlinkErr.message);
      }
    }
  }
};