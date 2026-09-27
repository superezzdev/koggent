import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  ArrowLeft,
  Volume2,
  Terminal,
  Layers,
  Presentation,
  Scan,
  ExternalLink,
  Play,
  Pause,
} from "lucide-react";

import koggentConversational from "../../../assets/landing/koggent-conversational.webp";
import koggentCoding from "../../../assets/landing/koggent-coding.webp";
import koggentDocuments from "../../../assets/landing/koggent-documents.webp";
import koggentPresentation from "../../../assets/landing/koggent-presentation.webp";
import koggentVision from "../../../assets/landing/koggent-vision.webp";
import koggentSearch from "../../../assets/landing/koggent-search.webp";

const CAPABILITIES = [
  {
    id: "chat",
    index: "01",
    label: "Conversational",
    tag: "01 // Reasoning & Voice",
    accentColor: "rgba(99, 102, 241, 0.2)",
    accentBorder: "rgba(99, 102, 241, 0.4)",
    glowColor: "from-indigo-500/20 via-indigo-600/10 to-transparent",
    headlinePart1: "Deep reasoning,",
    headlinePart2: "nuanced multi-turn dialogue,",
    headlinePart3: "grounded in continuous voice.",
    body: "Engage in long-horizon reasoning, strategic brainstorming, and structured text drafting with context-aware conversational agents. Real-time audio dictation and memory that never drops your thread.",
    image: koggentConversational,
    imageAlt: "Conversational intelligence harmonic waveforms and glass ribbons",
    floatingAnnotation: () => (
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090b10]/90 text-white backdrop-blur-2xl border border-white/15 shadow-2xl space-y-3 max-w-sm">
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Volume2 size={13} className="text-indigo-400 animate-pulse" />
            <span className="text-white font-medium">Voice Dictation Stream</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
            280ms latency
          </span>
        </div>
        <div className="space-y-2">
          <p className="text-zinc-300 text-xs leading-relaxed">
            &ldquo;Evaluate actor-based concurrency versus distributed queues for real-time telemetry.&rdquo;
          </p>
          {/* Animated voice wave */}
          <div className="p-2.5 rounded-xl bg-white/[0.06] flex items-center justify-between gap-1 h-8 px-3">
            {[40, 80, 55, 95, 30, 70, 100, 60, 45, 90, 75, 50, 85, 40].map((h, i) => (
              <span
                key={i}
                className="w-1 bg-gradient-to-t from-indigo-500 to-cyan-400 rounded-full animate-pulse"
                style={{
                  height: `${h}%`,
                  animationDuration: `${0.6 + (i % 5) * 0.2}s`,
                }}
              />
            ))}
          </div>
          <div className="text-[11px] leading-relaxed font-mono text-indigo-300 flex items-center justify-between pt-1">
            <span>Actor mesh isolates state</span>
            <span className="text-zinc-500 text-[10px]">60 FPS</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "coding",
    index: "02",
    label: "Coding",
    tag: "02 // Software Construction",
    accentColor: "rgba(139, 92, 246, 0.2)",
    accentBorder: "rgba(139, 92, 246, 0.4)",
    glowColor: "from-violet-500/20 via-purple-600/10 to-transparent",
    headlinePart1: "Full-stack code,",
    headlinePart2: "generated and executed live",
    headlinePart3: "in the browser sandbox.",
    body: "Multi-file HTML, CSS, and JavaScript synthesis rendered instantly in an isolated Monaco DOM sandbox. Refactor, mount interactive canvas components, and inspect runtime state without leaving your train of thought.",
    image: koggentCoding,
    imageAlt: "Software creation precision glass syntax architecture",
    floatingAnnotation: () => (
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090b10]/90 text-white backdrop-blur-2xl border border-white/15 shadow-2xl space-y-3 max-w-sm font-mono text-xs">
        <div className="flex items-center justify-between text-[11px] text-zinc-400 pb-2 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <Terminal size={13} className="text-violet-400" />
            <span className="text-white font-medium">index.html • style.css • script.js</span>
          </div>
          <span className="text-[10px] text-violet-300 bg-violet-500/20 px-1.5 py-0.5 rounded">
            Monaco V8
          </span>
        </div>
        <div className="space-y-1 text-[11px] text-zinc-300 leading-relaxed bg-black/60 p-2.5 rounded-xl border border-white/5">
          <p className="text-zinc-500">// Interactive DOM Artifact</p>
          <p><span className="text-violet-400">const</span> canvas = <span className="text-indigo-400">new</span> Scene(&#123; reactive: <span className="text-cyan-400">true</span> &#125;);</p>
          <p className="flex items-center">
            <span>canvas.mount(&apos;#root&apos;);</span>
            <span className="inline-block w-1.5 h-3 bg-emerald-400 ml-1 animate-pulse" />
          </p>
        </div>
        <div className="pt-1 flex items-center justify-between text-[10px] text-zinc-400">
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Sandbox: Active
          </span>
          <span className="text-white font-medium">60 FPS</span>
        </div>
      </div>
    ),
  },
  {
    id: "pdf",
    index: "03",
    label: "Documents",
    tag: "03 // Document Intelligence",
    accentColor: "rgba(244, 63, 94, 0.2)",
    accentBorder: "rgba(244, 63, 94, 0.4)",
    glowColor: "from-rose-500/20 via-pink-600/10 to-transparent",
    headlinePart1: "Complex filings,",
    headlinePart2: "indexed into verified vector chunks",
    headlinePart3: "with grounded citations.",
    body: "Upload dense financial prospectuses, technical whitepapers, and legal covenants. Koggent extracts exact paragraph chunks, grounding every statement in verifiable primary text.",
    image: koggentDocuments,
    imageAlt: "Document layers floating in architectural studio with vector scanning lines",
    floatingAnnotation: () => (
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090b10]/90 text-white backdrop-blur-2xl border border-white/15 shadow-2xl space-y-2.5 max-w-sm">
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pb-2 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <Layers size={13} className="text-rose-400" />
            <span className="text-white font-medium">annual-report-2025.pdf</span>
          </div>
          <span className="text-[10px] text-zinc-400 bg-white/10 px-1.5 py-0.5 rounded">Page 24</span>
        </div>
        <p className="text-zinc-300 text-xs italic leading-relaxed bg-white/[0.04] p-2.5 rounded-xl border border-white/5">
          &ldquo;Operating margins improved by 18.4% primarily due to automated pipeline efficiencies.&rdquo;
        </p>
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
            <span>Vector Similarity: 0.948</span>
            <span className="text-emerald-400 font-medium">94.8% Match</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-rose-500 to-indigo-500 rounded-full w-[94.8%]" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "ppt",
    index: "04",
    label: "Keynotes",
    tag: "04 // Presentation Architecture",
    accentColor: "rgba(245, 158, 11, 0.2)",
    accentBorder: "rgba(245, 158, 11, 0.4)",
    glowColor: "from-amber-500/20 via-orange-600/10 to-transparent",
    headlinePart1: "Raw ideas,",
    headlinePart2: "structured into narrative slide decks",
    headlinePart3: "with speaker notes.",
    body: "Draft investor pitches, architecture overviews, and executive strategy reviews. The keynote engine structures concepts into cohesive visual slides with typography, pacing, and presenter notes.",
    image: koggentPresentation,
    imageAlt: "Minimalist presentation canvases cascading in gallery studio",
    floatingAnnotation: () => (
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090b10]/90 text-white backdrop-blur-2xl border border-white/15 shadow-2xl space-y-2.5 max-w-sm">
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pb-2 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <Presentation size={13} className="text-amber-400" />
            <span className="text-white font-medium">Q3 Strategy Keynote</span>
          </div>
          <span className="text-[10px] text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded">Deck v1.2</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <div className="p-2.5 rounded-xl bg-white/[0.06] border border-white/5 space-y-1">
            <span className="text-zinc-500 font-mono block text-[9px]">SLIDE 01</span>
            <span className="font-semibold text-white block">The Dilemma</span>
            <span className="text-[9px] text-zinc-400 block truncate">Tool overload</span>
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-500/30 space-y-1">
            <span className="text-indigo-400 font-mono block text-[9px]">SLIDE 02</span>
            <span className="font-semibold text-white block">Unified Mesh</span>
            <span className="text-[9px] text-indigo-300 block truncate">6 agents linked</span>
          </div>
        </div>
        <div className="text-[10px] text-zinc-400 font-mono pt-1 flex items-center justify-between">
          <span>Speaker notes attached</span>
          <span className="text-white font-medium">6 Slides Ready</span>
        </div>
      </div>
    ),
  },
  {
    id: "vision",
    index: "05",
    label: "Vision",
    tag: "05 // Spatial Visual Reasoning",
    accentColor: "rgba(6, 182, 212, 0.2)",
    accentBorder: "rgba(6, 182, 212, 0.4)",
    glowColor: "from-cyan-500/20 via-sky-600/10 to-transparent",
    headlinePart1: "Optical perception,",
    headlinePart2: "decoding schematics and UI layouts",
    headlinePart3: "with spatial clarity.",
    body: "Upload complex technical diagrams, circuit schematics, and high-fidelity mockups. Koggent reads component hierarchies, maps interface layouts, and answers fine-grained visual queries.",
    image: koggentVision,
    imageAlt: "Precision optical lenses and spatial planes decomposing a visual scene",
    floatingAnnotation: () => (
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090b10]/90 text-white backdrop-blur-2xl border border-white/15 shadow-2xl space-y-2.5 max-w-sm">
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pb-2 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <Scan size={13} className="text-cyan-400 animate-pulse" />
            <span className="text-white font-medium">system_architecture.png</span>
          </div>
          <span className="text-[10px] text-cyan-300 bg-cyan-500/20 px-1.5 py-0.5 rounded">Resolved</span>
        </div>
        <p className="text-zinc-300 text-xs leading-relaxed bg-white/[0.04] p-2.5 rounded-xl border border-white/5">
          Detected reverse proxy gateway on port 8000, 4 microservice nodes, and real-time WebSocket state stream.
        </p>
        <div className="text-[10px] font-mono text-zinc-400 flex items-center justify-between pt-1">
          <span className="text-cyan-400">Bounding Box: [120, 84, 240, 90]</span>
          <span className="text-emerald-400">100% Optical Acc</span>
        </div>
      </div>
    ),
  },
  {
    id: "search",
    index: "06",
    label: "Web Search",
    tag: "06 // Live Web Retrieval",
    accentColor: "rgba(16, 185, 129, 0.2)",
    accentBorder: "rgba(16, 185, 129, 0.4)",
    glowColor: "from-emerald-500/20 via-teal-600/10 to-transparent",
    headlinePart1: "Real-time search,",
    headlinePart2: "autonomous internet synthesis",
    headlinePart3: "with verifiable proof.",
    body: "When fresh context is required, Koggent autonomously queries the live web, parses primary source documentation, and synthesizes accurate answers anchored to verifiable source links.",
    image: koggentSearch,
    imageAlt: "Fiber optic knowledge threads connecting floating frosted glass nodes",
    floatingAnnotation: () => (
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090b10]/90 text-white backdrop-blur-2xl border border-white/15 shadow-2xl space-y-2.5 max-w-sm">
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pb-2 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <ExternalLink size={13} className="text-emerald-400" />
            <span className="text-white font-medium">Autonomous Web Retrieval</span>
          </div>
          <span className="text-[10px] text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded">5 Sources</span>
        </div>
        <p className="text-zinc-300 text-xs leading-relaxed bg-white/[0.04] p-2.5 rounded-xl border border-white/5">
          Synthesized current benchmark metrics across 4 independent sources with real-time indexing timestamps.
        </p>
        <div className="flex items-center gap-1.5 pt-1 text-[10px] font-mono text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Grounding Proof Verified</span>
        </div>
      </div>
    ),
  },
];

const AUTOPLAY_DURATION = 6500; // 6.5s per capability story

export default function CapabilityStory() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const activeCap = CAPABILITIES[activeIndex];
  const AnnotationComponent = activeCap.floatingAnnotation;

  // Autoplay story timeline
  useEffect(() => {
    if (!isPlaying || isHovered) return;

    const intervalTime = 50;
    const increment = (intervalTime / AUTOPLAY_DURATION) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveIndex((current) => (current + 1) % CAPABILITIES.length);
          return 0;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, activeIndex]);

  // Reset progress when active capability changes
  const handleSelectTab = (idx) => {
    setActiveIndex(idx);
    setProgress(0);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % CAPABILITIES.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + CAPABILITIES.length) % CAPABILITIES.length);
    setProgress(0);
  };

  return (
    <section
      id="capabilities"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative bg-white py-24 sm:py-32 lg:py-40 overflow-hidden"
    >
      {/* Top Divider */}
      <div aria-hidden="true" className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-12 sm:mb-16">
        <div className="h-px bg-zinc-100" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* Minimalist Editorial Category Index with Story Progress Bars */}
        <div className="flex flex-wrap items-center justify-between gap-6 pb-8 sm:pb-12 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.28em] text-zinc-400 select-none">
              03 // Capabilities
            </span>
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
              title={isPlaying ? "Pause autoplay story" : "Play story"}
              aria-label={isPlaying ? "Pause autoplay" : "Play autoplay"}
            >
              {isPlaying ? <Pause size={12} /> : <Play size={12} />}
            </button>
          </div>

          {/* Interactive Navigation Tabs with Smooth Animated Progress Lines */}
          <nav aria-label="Capabilities navigation" className="flex flex-wrap items-center gap-4 sm:gap-7">
            {CAPABILITIES.map((cap, idx) => {
              const isCurr = activeIndex === idx;
              return (
                <button
                  key={cap.id}
                  type="button"
                  onClick={() => handleSelectTab(idx)}
                  className={`relative text-xs sm:text-sm transition-all duration-200 cursor-pointer pb-2.5 ${
                    isCurr
                      ? "text-zinc-950 font-bold"
                      : "text-zinc-400 hover:text-zinc-700 font-normal"
                  }`}
                >
                  <span className="font-mono text-[10px] mr-1.5 opacity-60">{cap.index}</span>
                  <span>{cap.label}</span>

                  {/* Active Tab Track with Smooth Filling Story Progress */}
                  {isCurr ? (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-zinc-200 overflow-hidden rounded-full">
                      <div
                        className="h-full bg-zinc-950 transition-all duration-75 ease-linear rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  ) : (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-transparent" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Unboxed Editorial Stage: Asymmetric, Free-Floating with Smooth Spring Crossfade */}
        <div className="pt-12 sm:pt-16 lg:pt-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* LEFT: Uneven Monochromatic Typography with Stable Container */}
          <div className="lg:col-span-6 flex flex-col justify-center min-h-[380px] sm:min-h-[420px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCap.id}
                initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Eyebrow Tag */}
                <span className="text-[11px] font-mono uppercase tracking-[0.24em] text-zinc-400 block mb-6 select-none flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
                  {activeCap.tag}
                </span>

                {/* Dramatic Uneven Headline */}
                <h3 className="tracking-[-0.045em] leading-[0.93] mb-8 select-none">
                  <span className="block text-[clamp(2.75rem,5.5vw,5.5rem)] font-extrabold text-zinc-950">
                    {activeCap.headlinePart1}
                  </span>
                  <span className="block text-[clamp(1.85rem,3.8vw,3.6rem)] font-light text-zinc-400 pl-4 sm:pl-8 italic my-1">
                    {activeCap.headlinePart2}
                  </span>
                  <span className="block text-[clamp(2.25rem,4.5vw,4.5rem)] font-bold text-zinc-950">
                    {activeCap.headlinePart3}
                  </span>
                </h3>

                {/* Refined Monochrome Body Copy */}
                <p className="text-[17px] sm:text-lg text-zinc-600 leading-relaxed font-normal max-w-xl mb-10">
                  {activeCap.body}
                </p>

                {/* Navigation and Chapter Indicator */}
                <div className="flex items-center gap-5 pt-2">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800 active:scale-[0.98] transition-all cursor-pointer group shadow-md hover:shadow-xl"
                  >
                    <span>Next: {CAPABILITIES[(activeIndex + 1) % CAPABILITIES.length].label}</span>
                    <ArrowRight size={14} className="text-zinc-400 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={handlePrev}
                    className="p-3 rounded-full border border-zinc-200 hover:bg-zinc-100 text-zinc-700 hover:text-zinc-950 transition-colors cursor-pointer"
                    aria-label="Previous capability"
                  >
                    <ArrowLeft size={14} />
                  </button>

                  <div className="text-xs font-mono text-zinc-400 ml-2">
                    <span className="text-zinc-950 font-bold">{activeCap.index}</span> of 06
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT: Unboxed Visual Artwork with Cinematic Scale Transition & Floating Annotation Capsule */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] flex items-center justify-center">

              {/* Dynamic Ambient Colored Lighting Halo shifting per capability */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`glow-${activeCap.id}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 0.7, scale: 1.05 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  aria-hidden="true"
                  className={`absolute inset-0 bg-gradient-to-tr ${activeCap.glowColor} blur-3xl rounded-full pointer-events-none -z-10`}
                />
              </AnimatePresence>

              {/* Unboxed Artwork Image with Silky Fade-In and Smooth Scale */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeCap.id}
                  src={activeCap.image}
                  alt={activeCap.imageAlt}
                  initial={{ opacity: 0, scale: 1.04, filter: "blur(4px)" }}
                  animate={{ opacity: 1, scale: 1.0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.97, filter: "blur(4px)" }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full object-cover rounded-3xl shadow-2xl shadow-zinc-950/20 select-none will-change-transform"
                  loading="eager"
                  decoding="async"
                />
              </AnimatePresence>

              {/* Floating Architectural Annotation Capsule — Resting over the art with organic offset */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`annotation-${activeCap.id}`}
                  initial={{ opacity: 0, y: 24, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1.0 }}
                  exit={{ opacity: 0, y: 12, scale: 0.96 }}
                  transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute -bottom-6 -left-2 sm:-bottom-8 sm:-left-6 z-20"
                >
                  <AnnotationComponent />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
