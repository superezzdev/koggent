import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  Code2,
  FileText,
  Globe,
  Check,
  Zap,
  Terminal,
  Eye,
  Sparkles,
  RotateCcw,
  Cpu,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LoadingAnimation from "../../../components/LoadingAnimation";

gsap.registerPlugin(ScrollTrigger);

const MODES = [
  {
    id: "coding",
    label: "Coding Agent",
    icon: Code2,
    prompt: "Build an interactive analytics dashboard with live SVG charts and reactive filters.",
    agentTag: "Coding Agent • Monaco Sandbox",
    statusText: "Synthesizing multi-file V8 DOM runtime...",
    resultTitle: "Analytics Dashboard (Multi-file Artifact)",
    resultSnippet:
      "Generated index.html, style.css, script.js with reactive charts and live DOM sandbox preview.",
    latency: "0.38s",
    tokens: "1,240 tokens",
    artifactTitle: "Interactive Canvas Engine",
    codeLines: [
      "// Multi-file Artifact (Live V8 Preview)",
      "import { CanvasEngine } from '@koggent/runtime';",
      "",
      "const chart = new CanvasEngine({",
      "  stream: true,",
      "  theme: 'dark',",
      "  refreshRate: 60,",
      "  onFrame: (metrics) => metrics.render()",
      "});",
      "chart.mount('#root');",
    ],
  },
  {
    id: "rag",
    label: "PDF Agent",
    icon: FileText,
    prompt: "Extract risk factors and capital reserve covenants from Section 4.2 of the annual filing.",
    agentTag: "PDF Agent • Vector RAG",
    statusText: "Matching cosine vector embeddings across 38 pages...",
    resultTitle: "Risk Factor Matrix & Financial Covenants",
    resultSnippet:
      "Retrieved 3 vector chunks from pages 24-26. Extracted liquidity coverage ratios and debt covenant obligations.",
    latency: "0.44s",
    tokens: "890 tokens",
    artifactTitle: "Verified Vector Citations",
    codeLines: [
      "[Vector Chunk #14 — 10-K Filing p.24]",
      "Similarity: 0.948 (94.8% semantic match)",
      "Status: Grounded Primary Citation",
      "",
      "Clause: 'The Company covenants to maintain a minimum",
      "liquidity buffer equal to 125% of projected 90-day",
      "operational disbursements under stressed conditions.'",
    ],
  },
  {
    id: "search",
    label: "Search Agent",
    icon: Globe,
    prompt: "Find current benchmarks for open-weights 120B reasoning models across mathematical proof tasks.",
    agentTag: "Search Agent • Web Retrieval",
    statusText: "Querying live web index & academic preprints...",
    resultTitle: "Live Benchmark Synthesis & Verified Sources",
    resultSnippet:
      "Autonomous query dispatched across 4 scholarly sources. Compiled throughput speeds and memory requirements with verified URLs.",
    latency: "0.52s",
    tokens: "1,450 tokens",
    artifactTitle: "Live Retrieval Graph",
    codeLines: [
      "[Web Retrieval Graph — Live Synthesis]",
      "Query: '120b math reasoning benchmarks 2025'",
      "Citations: 4 verified scholarly links",
      "Grounding Score: 99.8%",
      "",
      "1. DeepSeekMath-120B: 88.4% on MATH-500",
      "2. Qwen-2.5-Math-72B: 85.9% on GSM8K",
      "3. Llama-3.1-405B-Instruct: 89.2% benchmark",
    ],
  },
];

export default function ExperienceSection({ onOpenAuth }) {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const frameRef = useRef(null);
  const artifactRef = useRef(null);

  const [currentModeId, setCurrentModeId] = useState("coding");
  const [executionState, setExecutionState] = useState("done"); // 'idle' | 'running' | 'done'

  const currentMode = MODES.find((m) => m.id === currentModeId) || MODES[0];

  const handleTabClick = (id) => {
    if (id === currentModeId) return;
    setCurrentModeId(id);
    setExecutionState("running");

    // Dynamic authentic execution sequence
    setTimeout(() => {
      setExecutionState("done");
    }, 750);
  };

  const handleReplay = () => {
    setExecutionState("running");
    setTimeout(() => {
      setExecutionState("done");
    }, 850);
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      gsap.set([headlineRef.current, frameRef.current, artifactRef.current], { opacity: 1, y: 0, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(headlineRef.current, {
        opacity: 0,
        y: 36,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headlineRef.current,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(frameRef.current, {
        opacity: 0,
        y: 48,
        scale: 0.98,
        duration: 1.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: frameRef.current,
          start: "top 78%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative py-24 sm:py-32 lg:py-36 bg-[#060608] text-white overflow-hidden"
    >
      {/* Subtle ambient radial atmosphere */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-indigo-500/15 via-purple-500/8 to-transparent blur-3xl pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">

        {/* Section Header */}
        <div className="max-w-3xl mb-10 sm:mb-14">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[11px] font-mono uppercase tracking-[0.24em] font-semibold text-zinc-500 select-none flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              04 / Experience
            </span>
          </div>

          <h2
            ref={headlineRef}
            className="text-[clamp(2.25rem,4.5vw,4.5rem)] font-bold text-white tracking-[-0.035em] leading-[0.98] mb-5"
          >
            From idea to result,<br />
            <span className="text-zinc-400 font-light italic">without leaving the workspace.</span>
          </h2>
          <p className="text-[17px] sm:text-lg text-zinc-400 leading-relaxed font-normal">
            Switch intelligences within one continuous session. Context stays. Flow stays.
          </p>
        </div>

        {/* Mode Selector Tabs + Live Replay Trigger */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-2.5">
            {MODES.map((mode) => {
              const Icon = mode.icon;
              const isActive = currentModeId === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => handleTabClick(mode.id)}
                  id={`exp-tab-${mode.id}`}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-white text-zinc-950 font-semibold shadow-lg shadow-white/10 border border-white scale-[1.02]"
                      : "bg-white/[0.04] text-zinc-400 border border-white/10 hover:bg-white/[0.08] hover:text-white font-medium"
                  }`}
                >
                  <Icon size={13} className={isActive ? "text-indigo-600" : "text-zinc-400"} />
                  <span>{mode.label}</span>
                </button>
              );
            })}
          </div>

          {/* Replay Simulation Button */}
          <button
            type="button"
            onClick={handleReplay}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-zinc-300 text-xs font-mono transition-colors cursor-pointer"
          >
            <RotateCcw size={12} className={executionState === "running" ? "animate-spin text-cyan-400" : ""} />
            <span>Simulate Live Execution</span>
          </button>
        </div>

        {/* Wide Cinematic Product Visual Frame */}
        <div ref={frameRef} className="w-full">
          <div className="relative p-1.5 sm:p-2.5 rounded-2xl sm:rounded-3xl bg-white/[0.03] border border-white/[0.08] shadow-2xl shadow-black/80">
            <div className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden border border-white/[0.1] shadow-2xl shadow-black/60 bg-[#0d0f14]">

              {/* Window Chrome Titlebar */}
              <div className="flex items-center justify-between px-4 sm:px-5 py-3 bg-[#08090d] border-b border-white/[0.08] select-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span>{currentMode.agentTag}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
                  <span>{currentMode.latency}</span>
                  <span className="text-zinc-600">•</span>
                  <span>{currentMode.tokens}</span>
                </div>
              </div>

              {/* Wide Multi-Column Workspace Canvas */}
              <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.08]">

                {/* Left/Central Conversation Thread */}
                <div className="lg:col-span-7 p-5 sm:p-7 space-y-4 min-h-[300px] flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* User Prompt Bubble */}
                    <div className="flex justify-end">
                      <div className="max-w-[88%] px-4 py-2.5 rounded-2xl rounded-tr-xs bg-indigo-600 text-white text-xs sm:text-sm leading-relaxed shadow-sm">
                        {currentMode.prompt}
                      </div>
                    </div>

                    {/* Agent Thinking Indicator — ONLY SHOWN WHILE RUNNING */}
                    <AnimatePresence>
                      {executionState === "running" && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.2 }}
                          className="flex justify-start"
                        >
                          <div className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] space-y-1">
                            <LoadingAnimation />
                            <p className="text-[10px] font-mono text-cyan-400 pl-1">
                              {currentMode.statusText}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Agent Response — Rendered when done */}
                    <AnimatePresence mode="wait">
                      {executionState === "done" && (
                        <motion.div
                          key={`response-${currentMode.id}`}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.35, ease: "easeOut" }}
                          className="flex justify-start"
                        >
                          <div className="max-w-[95%] p-4 rounded-2xl rounded-tl-xs bg-white/[0.04] border border-white/[0.1] text-xs sm:text-sm text-zinc-300 space-y-2 shadow-xl">
                            <div className="flex items-center justify-between text-xs pb-1.5 border-b border-white/[0.06]">
                              <span className="font-semibold text-white flex items-center gap-1.5">
                                <Check size={13} className="text-cyan-400" />
                                <span>{currentMode.resultTitle}</span>
                              </span>
                              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                                Verified
                              </span>
                            </div>
                            <p className="text-zinc-300 text-xs sm:text-[13px] leading-relaxed">
                              {currentMode.resultSnippet}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="text-[11px] text-zinc-500 font-mono pt-3 border-t border-white/[0.05] flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Cpu size={12} className="text-indigo-400" />
                      <span>Autonomous Mesh Dispatch</span>
                    </span>
                    <span className="text-emerald-400">100% In Sync</span>
                  </div>
                </div>

                {/* Right Artifact Area */}
                <div ref={artifactRef} className="lg:col-span-5 p-5 sm:p-7 bg-[#090b0f] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] text-xs">
                      <div className="flex items-center gap-2 font-mono text-zinc-300">
                        <Terminal size={13} className="text-violet-400" />
                        <span>{currentMode.artifactTitle}</span>
                      </div>
                      <span className="text-[10px] font-mono text-violet-300 bg-violet-500/20 px-2 py-0.5 rounded">
                        Reactive V8
                      </span>
                    </div>

                    <div className="mt-4 p-3.5 rounded-xl bg-black/70 border border-white/[0.06] font-mono text-[11px] text-slate-300 leading-relaxed shadow-inner overflow-hidden min-h-[160px]">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`artifact-${currentMode.id}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          {currentMode.codeLines.map((line, idx) => (
                            <p key={idx} className="whitespace-pre-wrap">
                              {line}
                            </p>
                          ))}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="mt-4 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] text-[11px] text-zinc-400 font-mono flex items-center justify-between">
                    <span>Runtime: Browser V8 DOM</span>
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Bottom Feature Strip */}
              <div className="px-5 sm:px-8 py-3 border-t border-white/[0.06] bg-[#0a0c10] grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px] text-zinc-500 font-mono">
                <div className="flex items-center justify-center gap-1.5 p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <Zap size={11} className="text-indigo-400" />
                  <span>Autonomous Mesh</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <Terminal size={11} className="text-violet-400" />
                  <span>Monaco Editor</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <Eye size={11} className="text-cyan-400" />
                  <span>Vector Indexing</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <Sparkles size={11} className="text-emerald-400" />
                  <span>Live Citations</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Below Dark Frame */}
          <div className="mt-8 flex items-center justify-start">
            <button
              type="button"
              onClick={onOpenAuth}
              id="exp-launch-btn"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-white text-zinc-950 font-semibold text-sm hover:bg-zinc-100 active:scale-[0.98] transition-all duration-150 cursor-pointer shadow-lg shadow-white/10 group"
            >
              <span>Launch Koggent Workspace</span>
              <ArrowRight size={14} className="text-zinc-700 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
