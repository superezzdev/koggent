import { getModel } from "../config/llmModels.js";

export const pptAgent = async (state) => {
  try {
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
- No markdown.
- No explanation.
- No code block.
- Return ONLY JSON.

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

    if (!data || !Array.isArray(data.slides)) {
      return {
        ...state,
        aiResponse: res.content || "Presentation outline generated.",
      };
    }

    const slidesMarkdown = data.slides
      .map(
        (slide, i) =>
          `### Slide ${i + 1}: ${slide.title}\n\n` +
          (Array.isArray(slide.points)
            ? slide.points.map((p) => `- ${p}`).join("\n")
            : ""),
      )
      .join("\n\n");

    return {
      ...state,
      aiResponse: `# 📊 Presentation: ${data.title || "Untitled"}\n\n${data.subtitle ? `*${data.subtitle}*\n\n` : ""}___\n\n${slidesMarkdown}`,
    };
  } catch (error) {
    console.error("PPT Agent error:", error);

    return {
      ...state,
      aiResponse: "Failed to generate presentation outline.",
    };
  }
};
