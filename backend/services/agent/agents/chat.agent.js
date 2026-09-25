import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { getModel } from "../config/llmModels.js";
import { getMemory } from "../config/memory.js";
import { deductCredits } from "../utils/deductCredits.js";
import { checkAgentLimit } from "../config/agentLimit.js";

export const chatAgent = async (state) => {
  try {
    if (state.aiResponse) {
      return state;
    }

    if (!state.creditsDeducted && !state.searchResults) {
      await checkAgentLimit(state.userId, state.agent || "chat");
    }

    let currentCredits = state.credits;
    if (!state.creditsDeducted) {
      const creditRes = await deductCredits(state.userId, "chat");
      if (!creditRes?.success) {
        return {
          ...state,
          aiResponse: `⚠️ ${creditRes?.message || "Not enough credits."} Please upgrade your plan in Settings & Billing to continue.`,
          credits: creditRes?.credits ?? state.credits,
        };
      }
      currentCredits = creditRes.credits;
    }

    const llm = await getModel(state.agent || "chat");

    const history = (await getMemory(state.conversationId)) || [];

    const searchContext = state.searchResults
      ? `
Web Search Results:

${JSON.stringify(state.searchResults)}

Answer the user using only the above search results.
`
      : "";

    const systemPrompt = `
You are koggent ai, an intelligent AI assistant.

${searchContext}

If searchContext exists:

- Use search results to answer.
- Do not mention internal tools.

Rules:

- For simple questions, greetings, and short queries, respond naturally in plain text.
- For technical, educational, coding, or detailed topics, use clean Markdown.

Formatting:

- Use # for titles and ## for sections.
- Leave a blank line after headings.
- Use bullet points for lists.
- Use numbered lists for steps.
- Use fenced code blocks with language tags for code.
- Keep paragraphs short and readable.
- Never write headings and content on the same line.
- Never generate large walls of text.
`;

    const messages = [new SystemMessage(systemPrompt)];

    const lastMsg = history[history.length - 1];
    const historyHasCurrentPrompt =
      lastMsg && lastMsg.role === "user" && lastMsg.content === state.prompt;

    const previousHistory = historyHasCurrentPrompt
      ? history.slice(0, -1)
      : history;

    previousHistory.forEach((msg) => {
      if (msg.role == "user" && msg.content) {
        messages.push(new HumanMessage(msg.content));
      }

      if (msg.role == "assistant" && msg.content) {
        messages.push(new AIMessage(msg.content));
      }
    });

    messages.push(new HumanMessage(state.prompt));

    const response = await llm.invoke(messages);

    return {
      ...state,
      aiResponse: response.content,
      credits: currentCredits,
      creditsDeducted: true,
    };
  } catch (error) {
    if (error.status === 429) {
      throw error;
    }
    console.error("chatAgent error:", error);
    return {
      ...state,
      aiResponse: "Error generating response.",
    };
  }
};
