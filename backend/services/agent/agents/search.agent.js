import { searchTool } from "../config/tavily.js";
import { searchUnsplashPhotos } from "../utils/unsplash.js";

export const searchAgent = async (state) => {
  try {
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
    };
  } catch (error) {
    return {
      ...state,
      searchResults: [],
      images: [],
    };
  }
};
