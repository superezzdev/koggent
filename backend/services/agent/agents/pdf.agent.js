import { getModel } from "../config/llmModels.js";
import { generatePdf } from "../utils/generatePDF.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { uploadToS3 } from "../utils/uploadToS3.js";

export const pdfAgent = async (state) => {
  try {
    const llm = await getModel("pdf");

    const prompt = `
You are an expert document writer.

Return ONLY valid JSON.

Do NOT return markdown.

Do NOT return explanations.

Structure:

{
    "title": "",
    "subtitle": "",
    "sections": [
        {
            "heading": "",
            "points": []
        }
    ]
}

Generate 4-8 sections.

Each section should have 3-6 concise bullet points.

Topic:

${state.prompt}
`;

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
          console.error("Failed to parse extracted PDF JSON block:", e.message);
        }
      }
    }

    if (!data || !data.title) {
      throw new Error("Invalid document structure returned from LLM");
    }

    const pdfBuffer = await generatePdf(data);

    const filename = `pdf-${Date.now()}.pdf`;

    await uploadToS3(filename, pdfBuffer, "application/pdf");

    const downloadUrl = await getFromS3(filename, 24 * 60 * 60);

    return {
      ...state,
      aiResponse: `# PDF Generated

**${data.title}**

📥 [Download PDF](${downloadUrl})

_Link expires in 24 hours._
`,
    };
  } catch (error) {
    console.log(error);

    return {
      ...state,
      aiResponse: "Failed to generate PDF.",
    };
  }
}