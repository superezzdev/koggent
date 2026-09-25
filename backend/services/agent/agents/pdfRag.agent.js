import fs from "fs";
import { PDFParse } from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { vectorStore, qdrantClient } from "../config/vectorDb.js";
import { getModel } from "../config/llmModels.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { deductCredits } from "../utils/deductCredits.js";
import { checkAgentLimit } from "../config/agentLimit.js";

export const pdfRag = async (state) => {
  await checkAgentLimit(state.userId, state.agent || "pdfRag");

  let store = null;
  let collectionName = null;

  try {
    if (!state.file?.path || !fs.existsSync(state.file.path)) {
      return {
        ...state,
        aiResponse: "Please upload a valid PDF file to analyze.",
      };
    }

    const creditRes = await deductCredits(state.userId, "pdf", "pdfRag");
    if (!creditRes?.success) {
      return {
        ...state,
        aiResponse: `⚠️ ${creditRes?.message || "Not enough credits."} Please upgrade your plan in Settings & Billing to continue.`,
        credits: creditRes?.credits ?? state.credits,
        creditsDeducted: true,
      };
    }

    const buffer = fs.readFileSync(state.file.path);

    const pdf = new PDFParse({
      data: buffer,
    });

    const result = await pdf.getText();
    const text = (result?.text || "").trim();

    if (!text) {
      return {
        ...state,
        aiResponse:
          "Could not extract readable text from the uploaded PDF. Please verify that the PDF is not scanned as an image or empty.",
        credits: creditRes.credits,
        creditsDeducted: true,
      };
    }

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await splitter.createDocuments([text]);
    if (!docs || docs.length === 0) {
      return {
        ...state,
        aiResponse: "Could not process document segments from the uploaded PDF.",
        credits: creditRes.credits,
        creditsDeducted: true,
      };
    }

    collectionName = `pdf-${Date.now()}`;
    store = await vectorStore(docs, collectionName);

    const question =
      state.prompt?.trim() ||
      "Please provide a comprehensive summary and key takeaways from this PDF.";

    let context = "";
    if (docs.length <= 5) {
      context = docs.map((d) => d.pageContent).join("\n\n");
    } else {
      const relevantDocs = await store.similaritySearch(question, 6);
      const docContents = new Set(relevantDocs.map((d) => d.pageContent));
      if (!docContents.has(docs[0].pageContent)) {
        relevantDocs.unshift(docs[0]);
      }
      context = relevantDocs.map((d) => d.pageContent).join("\n\n");
    }

    const llm = await getModel("pdfRag");

    const messages = [
      new SystemMessage(`You are Koggent PDF Assistant.

Rules:
- Answer accurately and thoroughly using the provided document context.
- Extract any numbers, statistics, percentages, grades, names, dates, or tables present in the context.
- If the requested information is genuinely not present in the document, reply: "I couldn't find this information in the uploaded PDF."
- Use clean Markdown formatting with clear headings or bullet points where appropriate.
`),
      new HumanMessage(`Document Context:
${context}

Question:
${question}
`),
    ];

    const response = await llm.invoke(messages);

    const replyContent =
      typeof response?.content === "string"
        ? response.content
        : Array.isArray(response?.content)
          ? response.content.map((c) => (typeof c === "string" ? c : c?.text || "")).join("\n")
          : String(response?.content || "");

    return {
      ...state,
      aiResponse: replyContent,
      credits: creditRes.credits,
      creditsDeducted: true,
    };
  } catch (error) {
    console.error("pdfRag error:", error);

    return {
      ...state,
      aiResponse: "Failed to analyze PDF.",
    };
  } finally {
    if (collectionName) {
      try {
        if (store?.client?.deleteCollection) {
          await store.client.deleteCollection(collectionName);
        } else if (qdrantClient?.deleteCollection) {
          await qdrantClient.deleteCollection(collectionName);
        }
      } catch (cleanupErr) {
        console.warn("Notice: Temporary collection cleanup:", cleanupErr.message);
      }
    }

    if (state.file?.path && fs.existsSync(state.file.path)) {
      try {
        fs.unlinkSync(state.file.path);
      } catch (err) {
        console.warn("Failed to unlink temp PDF file:", err.message);
      }
    }
  }
};
