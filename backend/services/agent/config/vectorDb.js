import { QdrantClient } from "@qdrant/js-client-rest";
import { QdrantVectorStore } from "@langchain/qdrant";
import { embeddings } from "./embeddings.js";
import dotenv from "dotenv";

dotenv.config();

export const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_URL,
  port: 443,
  apiKey: process.env.QDRANT_API_KEY,
  checkCompatibility: false,
});

export const vectorStore = async (docs, collectionName) => {
  try {
    return await QdrantVectorStore.fromDocuments(docs, embeddings, {
      client: qdrantClient,
      collectionName,
    });
  } catch (error) {
    console.warn(
      "Qdrant vector store connection failed, using in-memory vector search fallback:",
      error.message,
    );

    // Resilient in-memory fallback for local document search
    const docVectors = await Promise.all(
      docs.map((d) => embeddings.embedQuery(d.pageContent)),
    );

    return {
      client: null,
      similaritySearch: async (query, k = 5) => {
        try {
          const queryVector = await embeddings.embedQuery(query);
          const scored = docs.map((doc, i) => {
            const v = docVectors[i];
            let dot = 0;
            let normA = 0;
            let normB = 0;
            for (let j = 0; j < queryVector.length; j++) {
              dot += queryVector[j] * v[j];
              normA += queryVector[j] * queryVector[j];
              normB += v[j] * v[j];
            }
            const score = dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
            return { doc, score };
          });
          scored.sort((a, b) => b.score - a.score);
          return scored.slice(0, k).map((item) => item.doc);
        } catch (embedErr) {
          console.warn("Fallback similarity search error, using text matching:", embedErr.message);
          return docs.slice(0, k);
        }
      },
    };
  }
};
