import { getModel } from "../config/llmModels.js";
import {
  getRelevantImagesForPrompt,
  replaceBrokenImages,
} from "../utils/unsplash.js";

// -----------------------------------------------------------------------
// Advanced tool detection — only injected into the prompt if the user
// actually asked for it. Keeps default output lean (vanilla HTML/CSS/JS)
// while unlocking heavier tooling on demand.
// -----------------------------------------------------------------------
const ADVANCED_TOOLS = [
  {
    match: /\bgsap\b/i,
    name: "GSAP",
    cdn: '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>\n<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>',
    note: "Use GSAP + ScrollTrigger for scroll-driven, cinematic reveal/parallax animation sequences. Prefer timelines over isolated tweens.",
  },
  {
    match: /\blenis\b|smooth scroll(ing)?\b/i,
    name: "Lenis",
    cdn: '<script src="https://cdnjs.cloudflare.com/ajax/libs/lenis/1.1.13/lenis.min.js"></script>',
    note: "Use Lenis for buttery inertia-based smooth scrolling. Sync its RAF loop with GSAP ScrollTrigger.update if GSAP is also used.",
  },
  {
    match: /\baos\b|animate on scroll\b/i,
    name: "AOS",
    cdn: '<link href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.1/aos.css" rel="stylesheet"><script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.1/aos.js"></script>',
    note: "Use AOS for lightweight scroll-reveal where a full GSAP timeline is overkill.",
  },
  {
    match: /\bthree(\.js)?\b|\bwebgl\b|3d (scene|background|hero)/i,
    name: "Three.js",
    cdn: '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>',
    note: "Use Three.js (r128 API) for any 3D/WebGL hero backgrounds or interactive scenes. Keep geometry counts sane for mobile performance.",
  },
  {
    match: /\btailwind\b/i,
    name: "Tailwind",
    cdn: '<script src="https://cdn.tailwindcss.com"></script>',
    note: "Use Tailwind utility classes instead of hand-written CSS. Still define a custom theme via tailwind.config inline for brand colors/fonts — never ship default Tailwind blue/gray as the palette.",
  },
  {
    match: /\bswiper\b|carousel|slider/i,
    name: "Swiper",
    cdn: '<link href="https://cdnjs.cloudflare.com/ajax/libs/Swiper/11.1.4/swiper-bundle.min.css" rel="stylesheet"><script src="https://cdnjs.cloudflare.com/ajax/libs/Swiper/11.1.4/swiper-bundle.min.js"></script>',
    note: "Use Swiper for any carousel/slider requirement instead of hand-rolling scroll-snap logic.",
  },
];

function detectAdvancedTools(prompt) {
  return ADVANCED_TOOLS.filter((t) => t.match.test(prompt));
}

// -----------------------------------------------------------------------
// Design system brief — this is the actual lever for "award-winning"
// output. Vague adjectives ("beautiful", "modern") get ignored by LLMs;
// concrete constraints (ratios, scales, named techniques) don't.
// -----------------------------------------------------------------------
const DESIGN_SYSTEM_BRIEF = `
DESIGN STANDARD: Build to an Awwwards Site-of-the-Day / FWA bar, not a template bar.
Judge every decision against: does this look like it shipped from a top design studio
(Locomotive, Resn, Active Theory, Basement.studio), or does it look like a Bootstrap starter?
If the latter, redo it.

1. COLOR THEORY
   - Pick ONE dominant neutral (near-black or near-white base), ONE accent color used
     sparingly (CTAs, highlights, ~10% of visual weight), and 1–2 supporting tones.
   - Follow a 60/30/10 distribution (dominant / secondary / accent). Never introduce a
     color that isn't in the defined palette.
   - All text-on-background pairs must meet WCAG AA contrast (4.5:1 body, 3:1 large text).
   - Define the palette as CSS custom properties in :root before writing any other CSS.

2. TYPOGRAPHY
   - Use exactly two typefaces: one display/heading face with character, one clean
     body face. Load via Google Fonts <link>, never system-default-looking stacks.
   - Establish a modular type scale (e.g. 1.25 or 1.333 ratio) from a base of 16–18px.
     Every heading/body size must come from that scale — no arbitrary px values.
   - Set explicit line-height (1.1–1.2 for display, 1.5–1.7 for body) and letter-spacing
     (tight/negative on large display type, normal on body).
   - Hero/display headlines should feel oversized relative to typical templates —
     bias toward bold, confident scale (clamp() for fluid sizing across breakpoints).

3. HIERARCHY & LAYOUT
   - Every section needs one unambiguous focal point. Use size, weight, whitespace and
     color — not borders/boxes — to create hierarchy.
   - Generous whitespace/negative space is mandatory; cramped sections are an automatic
     failure. Prefer asymmetric, editorial grid layouts over centered-everything layouts.
   - Use a consistent spacing scale (e.g. 4/8px base unit) for all margin/padding.

4. CINEMATIC MOTION
   - Motion must feel intentional and staged, not decorative. Sequence entrances
     (staggered reveals, not everything fading in at once).
   - Respect prefers-reduced-motion: provide a reduced/no-motion fallback.
   - Use easing curves that feel premium (cubic-bezier custom curves, not linear/ease).
   - Micro-interactions on every interactive element (buttons, links, cards) —
     transform/opacity based, GPU-friendly, no layout-thrashing animations.

5. IMAGERY
   - Always source real imagery from the provided Unsplash image list or valid Unsplash CDN URLs (https://images.unsplash.com/...).
   - NEVER use "https://source.unsplash.com/" (deprecated/offline) or generic placeholder services.
   - Images should be treated as design elements: consider duotone overlays, grain,
     subtle parallax, or masked/clipped shapes rather than plain rectangles.

6. TECHNICAL BAR
   - Semantic HTML5, accessible landmarks, alt text on every image.
   - Fully responsive: fluid type/spacing (clamp()), tested mentally at 375px, 768px,
     1440px, 1920px.
   - No console errors, no unused code, no inline styles unless dynamically necessary.
`.trim();

export const codingAgent = async (state) => {
  const intentLlm = await getModel("intent");
  const llm = await getModel("coding");

  const intentRes = await intentLlm.invoke(`
You are an intent classifier.

Return ONLY one of these values.

CODE_GENERATION
CODE_REVIEW
CODE_EXPLANATION
DEBUGGING
OPTIMIZATION
CONVERSION
DOCUMENTATION

User Request:

${state.prompt}
    `);

  const rawIntent = (intentRes.content || "").trim().toUpperCase();
  const isCodeGeneration =
    rawIntent.includes("CODE_GENERATION") || rawIntent.includes("GENERATE");

  if (isCodeGeneration) {
    const [tools, fetchedImages] = await Promise.all([
      detectAdvancedTools(state.prompt),
      getRelevantImagesForPrompt(state.prompt, 8),
    ]);

    const imagesBlock =
      fetchedImages && fetchedImages.length
        ? `
REAL IMAGES AVAILABLE (Unsplash API)
===========================================
You MUST use these verified, working Unsplash image URLs in your <img> tags (src attribute) and CSS (e.g. background-image: url('...')).
Distribute them across suitable sections (Hero, Features, Services, Team, Cards, etc.):

${fetchedImages
  .map(
    (img, i) =>
      `- [Image ${i + 1}: "${img.title}"]\n  URL: ${img.url}\n  Alt: ${img.title}`
  )
  .join("\n\n")}

CRITICAL: NEVER use "https://source.unsplash.com/". ONLY use the exact URLs listed above.
        `.trim()
        : "";

    const toolsBlock = tools.length
      ? `
ADVANCED TOOLING REQUESTED
===========================================
The user's request implies the following libraries. Include their CDN <script>/<link>
tags in index.html <head>/before </body> as appropriate, and use them as instructed:

${tools.map((t) => `- ${t.name}\n  CDN: ${t.cdn}\n  Usage: ${t.note}`).join("\n\n")}

Do NOT introduce any other heavy framework beyond what's listed here and the default stack.
      `.trim()
      : `
No specific advanced library was requested. Achieve cinematic motion and polish using
pure CSS (custom properties, keyframes, clamp(), scroll-driven animations where
supported) and vanilla JS (IntersectionObserver for reveals, requestAnimationFrame
for smooth custom easing). Do not silently add third-party libraries.
      `.trim();

    const prompt = `
You are koggent Coding Agent — a senior product designer + front-end engineer who ships
award-winning, industry-grade websites, not generic templates.

Generate the requested project.

Default stack:
- HTML
- CSS
- JavaScript

Use React / Next.js / Vue ONLY if explicitly requested. Use TypeScript ONLY if explicitly
requested.

${DESIGN_SYSTEM_BRIEF}

${toolsBlock}

${imagesBlock}

STRUCTURE RULES
- Single page unless user asks otherwise.
- Mobile-first, fully responsive, accessible (semantic HTML, ARIA where needed, keyboard
  navigable).
- Performance-conscious: no render-blocking bloat, lazy-load offscreen images.
- Clean, well-commented, well-organized code — as if reviewed by a senior engineer.

Return ONLY valid JSON.

Schema:

{
    "files": [
        {
            "name": "index.html",
            "content": "..."
        },
        {
            "name": "style.css",
            "content": "..."
        },
        {
            "name": "script.js",
            "content": "..."
        }
    ]
}

Rules:
- Output must start with {
- Output must end with }
- No markdown
- No explanation
- No extra text
- No \`\`\`
- Never mention intent

User Request:

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
          console.error("Failed to parse extracted JSON block:", e.message);
        }
      }
    }

    if (!data || !Array.isArray(data.files) || data.files.length === 0) {
      return {
        ...state,
        aiResponse: res.content || "Code Generated Successfully.",
        artifacts: [],
      };
    }

    const sanitizedFiles = replaceBrokenImages(data.files, fetchedImages);

    return {
      ...state,
      aiResponse: "Code Generated Successfully.",
      artifacts: [
        {
          id: Date.now(),
          type: "Project",
          files: sanitizedFiles,
          title: state.prompt,
        },
      ],
      images: fetchedImages.map((img) => img.url),
    };
  }

  const res = await llm.invoke(`
The user's request is:

${rawIntent}

Return Markdown only.

Never generate project files.

Use headings like:

# Overview

## Explanation

## Problems

## Improvements

## Best Practices

## Optimized Code (if needed)

User Request:

${state.prompt}
    `);

  const data = res.content;

  return {
    ...state,
    aiResponse: data,
    artifacts: [],
  };
};
