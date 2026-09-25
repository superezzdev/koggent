import { getModel } from "../config/llmModels.js";
import { generatePpt } from "../utils/generatePpt.js";
import { uploadToS3 } from "../utils/uploadToS3.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { deductCredits } from "../utils/deductCredits.js";
import { checkAgentLimit } from "../config/agentLimit.js";


export const pptAgent = async (state) => {
    await checkAgentLimit(state.userId, state.agent || "ppt");

  try {
    const creditRes = await deductCredits(state.userId, "ppt");
    if (!creditRes?.success) {
      return {
        ...state,
        aiResponse: `⚠️ ${creditRes?.message || "Not enough credits."} Please upgrade your plan in Settings & Billing to continue.`,
        credits: creditRes?.credits ?? state.credits,
        creditsDeducted: true,
      };
    }

    const llm = await getModel("ppt");

    const prompt = `You are a professional presentation designer.

Return ONLY valid JSON.

Format:

{
    "title": "",
    "subtitle": "",
    "slides": [
        {
            "title": "",
            "points": [
                "",
                "",
                "",
                ""
            ]
        }
    ]
}

Rules:

- Generate exactly 6 content slides.
- Each slide should have 4-6 concise bullet points.
- Make the presentation logically structured.
- Start with an introduction/context slide.
- Progress through the main concepts.
- End the content slides with a conclusion/summary.
- Keep every bullet concise and presentation-friendly.
- Do not write long paragraphs.
- No markdown.
- No explanation.
- No code block.
- Return ONLY valid JSON.

Topic:

${state.prompt}`;

    const res = await llm.invoke(prompt);

    let data;
    try {
      let raw = (res.content || "").trim();
      if (raw.startsWith("```")) {
        raw = raw
          .replace(/^```(?:json)?\s*\n?/, "")
          .replace(/\n?\s*```$/, "")
          .trim();
      }
      data = JSON.parse(raw);
    } catch {
      const match = (res.content || "").match(/\{[\s\S]*\}/);
      if (match) {
        try {
          data = JSON.parse(match[0]);
        } catch (e) {
          console.error("Failed to parse extracted PPT JSON block:", e.message);
        }
      }
    }

    if (!data || !data.title || !Array.isArray(data.slides)) {
      throw new Error("Invalid presentation structure returned from LLM");
    }

    const ppt = await generatePpt(data);

    const buffer = await ppt.write({
      outputType: "nodebuffer",
    });

    const filename = `ppt-${Date.now()}.pptx`;

    await uploadToS3(
      filename,
      buffer,
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    );

    const downloadUrl = await getFromS3(filename, 24 * 60 * 60);

    return {
      ...state,
      aiResponse: `# Presentation Generated

**${data.title}**

📥 [Download PPT](${downloadUrl})

_Link expires in 24 hours._
`,
      credits: creditRes.credits,
      creditsDeducted: true,
    };
  } catch (error) {
    console.error("PPT generation error:", error);

    return {
      ...state,
      aiResponse: "Failed to generate PPT.",
    };
  }
};
