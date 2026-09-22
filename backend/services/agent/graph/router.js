import { getModel } from "../config/llmModels.js";

export const router = async (state) => {
  if (state.agent && state.agent !== "auto") {
    const rawAgent = String(state.agent).trim().toLowerCase();
    const normalized = rawAgent === "image" ? "vision" : rawAgent;
    return {
      ...state,
      agent: normalized,
    };
  }

  const llm = await getModel("router");

  const prompt = `You are an agent router.

Available agents:

- chat
- search
- coding
- pdf
- ppt
- vision

Rules:

chat:
General conversation,
explanations,
learning,
questions.

search:
Current events,
latest information,
news,
recent developments,
internet lookup.

coding:
Generate code,
debug code,
build projects,
architecture,
API design.

pdf:
Questions about generate PDFs
or document context.

ppt:
Questions about generate ppts
or ppt context.

vision:
Generate image,
create image

Return ONLY one word:

chat
search
coding
pdf
ppt
vision

User Query:

${state.prompt}
`;

  const response = await llm.invoke(prompt);
  const raw = (response?.content || "").trim().toLowerCase();
  const match = raw.match(/\b(chat|search|coding|pdf|ppt|vision|image)\b/);
  let cleanAgent = match ? match[1] : "chat";
  if (cleanAgent === "image") cleanAgent = "vision";

  return {
    ...state,
    agent: cleanAgent,
  };
};
