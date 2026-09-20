import { searchUnsplashPhotos } from "../utils/unsplash.js";
import { chatAgent } from "./chat.agent.js";

export const visionAgent = async (state) => {
  try {
    const photos = await searchUnsplashPhotos({
      query: state.prompt,
      perPage: 12,
    });

    if (!photos || photos.length === 0) {
      return chatAgent(state);
    }

    const imageUrls = photos.map((p) => p.url);
    const photoList = photos
      .slice(0, 6)
      .map(
        (p, i) =>
          `${i + 1}. **${p.title}** — by [${p.photographer}](${p.photographerUrl || "https://unsplash.com"})`
      )
      .join("\n");

    const aiResponse = `Here are curated high-resolution photographs for **"${state.prompt}"** from Unsplash:\n\n${photoList}\n\n*Click on any photo to view in high resolution.*`;

    return {
      ...state,
      aiResponse,
      images: imageUrls,
    };
  } catch (error) {
    console.error("visionAgent error:", error);
    return chatAgent(state);
  }
};

export const imageGenAgent = async (state) => {
  return visionAgent(state);
};
