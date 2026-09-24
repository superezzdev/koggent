import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getModel } from "../config/llmModels.js";
import fs from "fs";
import { deductCredits } from "../utils/deductCredits.js";

export const imageAnalyzer = async (state) => {
  try {
    if (!state.file?.path || !fs.existsSync(state.file.path)) {
      return {
        ...state,
        aiResponse: "Please upload a valid image file to analyze.",
      };
    }

    const creditRes = await deductCredits(state.userId, "vision", "imageAnalyzer");
    if (!creditRes?.success) {
      return {
        ...state,
        aiResponse: `⚠️ ${creditRes?.message || "Not enough credits."} Please upgrade your plan in Settings & Billing to continue.`,
        credits: creditRes?.credits ?? state.credits,
        creditsDeducted: true,
      };
    }

    const llm = await getModel("imageAnalyzer");

    const imageBuffer = fs.readFileSync(state.file.path);
    const base64Image = imageBuffer.toString("base64");

    const userPrompt =
      state.prompt?.trim() ||
      "Please analyze this image in detail and describe what you see.";

    const messages = [
      new SystemMessage(
        `You are Koggent Image Analyzer Agent.

Rules:
- Analyze only the uploaded image.
- Answer the user's question accurately.
- If text exists in the image, extract it.
- If charts or tables exist, explain them.
- If something is unclear, say so.
- Use clean Markdown formatting when helpful.
- Do not hallucinate.`
      ),
      new HumanMessage({
        content: [
          {
            type: "text",
            text: userPrompt,
          },
          {
            type: "image_url",
            image_url: {
              url: `data:${state.file.mimetype || "image/png"};base64,${base64Image}`,
            },
          },
        ],
      }),
    ];

    const response = await llm.invoke(messages);

    return {
      ...state,
      aiResponse: response.content,
      credits: creditRes.credits,
      creditsDeducted: true,
    };
  } catch (error) {
    console.error("imageAnalyzer error:", error);
    return {
      ...state,
      aiResponse: "Failed to analyze image file.",
    };
  } finally {
    if (state.file?.path && fs.existsSync(state.file.path)) {
      try {
        fs.unlinkSync(state.file.path);
      } catch (err) {
        console.warn("Failed to unlink temp image file:", err.message);
      }
    }
  }
};