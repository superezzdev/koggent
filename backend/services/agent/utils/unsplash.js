import axios from "axios";

// In-memory cache to conserve Unsplash API rate limit (50 req/hour on demo tier)
const cache = new Map();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

// Fallback high-quality Unsplash direct image URLs in case of API failure or quota limit
const FALLBACK_IMAGES = [
  {
    title: "Modern Architectural Space",
    url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80",
    photographer: "Unsplash",
  },
  {
    title: "Healthcare Medical Doctor",
    url: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=400&q=80",
    photographer: "Online Marketing",
  },
  {
    title: "Hospital Bed and Clinic",
    url: "https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=400&q=80",
    photographer: "Martha Dominguez",
  },
  {
    title: "Creative Studio Work",
    url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80",
    photographer: "Christopher Gower",
  },
  {
    title: "Cinematic Visuals",
    url: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=400&q=80",
    photographer: "Unsplash",
  },
];

/**
 * Searches Unsplash for photos matching the query using the UNSPLASH_ACCESS_KEY.
 */
export async function searchUnsplashPhotos({
  query,
  perPage = 8,
  orientation = "landscape",
}) {
  const cleanQuery = (query || "").trim();
  if (!cleanQuery) return FALLBACK_IMAGES.slice(0, perPage);

  const cacheKey = `${cleanQuery.toLowerCase()}_${perPage}_${orientation}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    console.warn("UNSPLASH_ACCESS_KEY is not set in environment.");
    return FALLBACK_IMAGES.slice(0, perPage);
  }

  try {
    const res = await axios.get("https://api.unsplash.com/search/photos", {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
      },
      params: {
        query: cleanQuery,
        per_page: perPage,
        orientation,
      },
      timeout: 6000,
    });

    const results = res.data?.results || [];
    if (!results.length) {
      return FALLBACK_IMAGES.slice(0, perPage);
    }

    const mapped = results.map((photo) => ({
      id: photo.id,
      title:
        photo.alt_description ||
        photo.description ||
        cleanQuery ||
        "Visual Element",
      url: photo.urls?.regular || photo.urls?.full || photo.urls?.small,
      thumb: photo.urls?.small || photo.urls?.thumb,
      photographer: photo.user?.name || "Unsplash Creator",
      photographerUrl: photo.user?.links?.html,
    }));

    cache.set(cacheKey, { timestamp: Date.now(), data: mapped });
    return mapped;
  } catch (error) {
    console.error(
      "Unsplash API search error:",
      error.response?.data?.errors || error.message
    );
    return FALLBACK_IMAGES.slice(0, perPage);
  }
}

/**
 * Extracts image search themes from a user prompt.
 * Filters out common action / template keywords.
 */
export function extractKeywords(prompt = "") {
  const stopWords = new Set([
    "build",
    "create",
    "make",
    "develop",
    "code",
    "generate",
    "design",
    "along",
    "with",
    "beautiful",
    "modern",
    "website",
    "web",
    "app",
    "application",
    "system",
    "landing",
    "page",
    "clean",
    "responsive",
    "using",
    "html",
    "css",
    "javascript",
    "js",
    "the",
    "and",
    "for",
    "in",
    "on",
    "at",
    "a",
    "an",
    "of",
    "to",
    "interactive",
    "animated",
  ]);

  const words = prompt
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));

  if (!words.length) return ["technology business"];

  // Pair words or use primary nouns
  const primaryTheme = words.slice(0, 3).join(" ");
  return [primaryTheme];
}

/**
 * Fetches a rich set of relevant Unsplash images for a coding project prompt.
 */
export async function getRelevantImagesForPrompt(prompt, count = 8) {
  const keywords = extractKeywords(prompt);
  const primaryQuery = keywords[0] || "modern website";

  const images = await searchUnsplashPhotos({
    query: primaryQuery,
    perPage: count,
    orientation: "landscape",
  });

  return images;
}

/**
 * Replaces any broken or deprecated image URLs (such as source.unsplash.com or generic placeholders)
 * in the generated project files with verified, working Unsplash URLs.
 */
export function replaceBrokenImages(files = [], availableImages = []) {
  if (!Array.isArray(files) || !files.length) return files;

  const imagePool =
    availableImages && availableImages.length
      ? availableImages
      : FALLBACK_IMAGES;

  const brokenUrlPattern =
    /https?:\/\/(?:source\.unsplash\.com|via\.placeholder\.com|placehold\.co|placeholder\.com)[^\s"'\)>]*/gi;

  let poolIndex = 0;
  const getNextImageUrl = () => {
    const img = imagePool[poolIndex % imagePool.length];
    poolIndex++;
    return img.url;
  };

  return files.map((file) => {
    if (!file || typeof file.content !== "string") return file;

    let content = file.content;
    if (brokenUrlPattern.test(content)) {
      content = content.replace(brokenUrlPattern, () => getNextImageUrl());
    }

    return {
      ...file,
      content,
    };
  });
}
