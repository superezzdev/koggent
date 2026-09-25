import { searchTool } from "../config/tavily.js";
import { searchUnsplashPhotos } from "../utils/unsplash.js";
import { deductCredits } from "../utils/deductCredits.js";
import { checkAgentLimit } from "../config/agentLimit.js";


export const searchAgent = async (state) => {
    await checkAgentLimit(state.userId, state.agent || "search");

  try {
    const creditRes = await deductCredits(state.userId, "search");
    if (!creditRes?.success) {
      return {
        ...state,
        aiResponse: `⚠️ ${creditRes?.message || "Not enough credits."} Please upgrade your plan in Settings & Billing to continue.`,
        searchResults: [],
        images: [],
        credits: creditRes?.credits ?? state.credits,
        creditsDeducted: true,
      };
    }

    const results = await searchTool.invoke({
      query: state.prompt,
    });

    let images = results.images;
    if (!images || !images.length) {
      const unsplashPhotos = await searchUnsplashPhotos({
        query: state.prompt,
        perPage: 4,
      });
      images = unsplashPhotos.map((p) => p.url);
    }

    return {
      ...state,
      searchResults: results,
      images,
      credits: creditRes.credits,
      creditsDeducted: true,
    };
  } catch (error) {
    console.error("searchAgent error:", error);
    return {
      ...state,
      searchResults: [],
      images: [],
    };
  }
};
