import { getModel } from "../config/llmModels.js";
import axios from "axios";
import { uploadToS3 } from "../utils/uploadToS3.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { deductCredits } from "../utils/deductCredits.js";


export const visionAgent = async (state) => {
  try {
    const creditRes = await deductCredits(state.userId, "vision");
    if (!creditRes?.success) {
      return {
        ...state,
        aiResponse: `⚠️ ${creditRes?.message || "Not enough credits."} Please upgrade your plan in Settings & Billing to continue.`,
        images: [],
        credits: creditRes?.credits ?? state.credits,
        creditsDeducted: true,
      };
    }

    const llm = await getModel("image");

    let prompt = state.prompt;

    try {
      const res = await llm.invoke(`
You are an elite AI image prompt engineer.
Convert the user request into a concise, vivid image generation prompt.

Rules:
- 1 to 2 sentences maximum.
- Include style, lighting, composition, and mood.
- DO NOT include conversational filler, markdown, explanations, or code blocks.
- Return ONLY the prompt text.

User Request:
${state.prompt}
      `);

      let generatedPrompt = (res?.content || "").trim();
      // Remove any markdown code fences or quotes
      generatedPrompt = generatedPrompt.replace(/^```[a-z]*\s*/i, "").replace(/\s*```$/, "");
      generatedPrompt = generatedPrompt.replace(/^["']|["']$/g, "").trim();

      if (generatedPrompt) {
        prompt = generatedPrompt;
      }
    } catch (llmError) {
      console.warn("LLM prompt enhancement failed, using raw prompt:", llmError.message);
    }

    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
    let finalUrl = imageUrl;

    try {
      const imageRes = await axios.get(imageUrl, {
        responseType: "arraybuffer",
        timeout: 45000,
      });

      const buffer = Buffer.from(imageRes.data);
      const filename = `image-${Date.now()}.png`;

      await uploadToS3(filename, buffer, "image/png");
      const downloadUrl = await getFromS3(filename, 24 * 60 * 60);
      // Note: The expiration time is set to 24 hours (86400 seconds) in this example.

      if (downloadUrl) {
        finalUrl = downloadUrl;
      }
    } catch (s3OrFetchError) {
      console.error(
        "S3 upload or buffer failed, falling back to direct image URL:",
        s3OrFetchError.message,
      );
    }

    return {
      ...state,
      images: [finalUrl],
      aiResponse: `
![Generated Image](${finalUrl})

📥 [Download Image](${finalUrl})

⏳ Link expires in 24 hours.
`,
      credits: creditRes.credits,
      creditsDeducted: true,
    };
  } catch (error) {
    console.error("visionAgent fatal error:", error);
    return {
      ...state,
      aiResponse: "Error generating image.",
    };
  }
};