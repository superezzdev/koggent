import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  Zap,
  MessageSquare,
  Code2,
  FileText,
  Presentation,
  ImageIcon,
  Globe,
  Mic,
  Send,
  Terminal,
  Activity,
} from "lucide-react";
import gsap from "gsap";
import koggentLogo from "../../../assets/brand/koggent-logo.png";
import koggentHeroAtmosphere from "../../../assets/landing/koggent-hero-atmosphere.webp";

const AGENT_MODES = {
  Auto: {
    label: "Auto",
    icon: Zap,
    prompt: "Build an interactive real-time analytics widget with dark aesthetic, SVG telemetry charts, and reactive filters.",
    routerTag: "Autonomous Router → Coding Specialist",
    latency: "0.42s latency",
    response: "Generated clean multi-file app with Monaco editor sandbox, reactive DOM state bindings, and sub-millisecond chart pipeline.",
    files: ["index.html", "style.css", "chart.js"],
    badge: "Auto Routed",
    codeFiles: {
      "chart.js": `// Live Sandbox Artifact: chart.js
import { CanvasEngine } from '@koggent/runtime';

const mesh = new CanvasEngine({
  metrics: ['latency_p99', 'rps', 'mesh_sync'],
  stream: true,
  theme: 'obsidian',
  onTick: (state) => state.paint()
});

mesh.mount('#canvas-root');`,
      "style.css": `/* Reactive Obsidian Canvas Theme */
.canvas-root {
  background: radial-gradient(circle at 50% 50%, #111422, #07080c);
  border-radius: 12px;
  box-shadow: 0 0 35px rgba(99, 102, 241, 0.15);
}`,
      "index.html": `<!DOCTYPE html>
<div class="canvas-root" id="canvas-root">
  <div class="telemetry-hud">60 FPS • 1.2ms</div>
</div>`,
    },
    note: "PDF Agent indexed telemetry benchmark specs from Section 4.2",
  },
  Chat: {
    label: "Chat",
    icon: MessageSquare,
    prompt: "Evaluate actor-concurrency mesh versus distributed event queues for sub-millisecond real-time telemetry dispatch.",
    routerTag: "Conversational Reasoning Engine",
    latency: "0.28s latency",
    response: "Actor meshes isolate state per socket with zero-serialization overhead, yielding 3.4x lower latency than Kafka under 50k conn.",
    files: ["actor-mesh.ts", "analysis.md"],
    badge: "Deep Reasoning",
    codeFiles: {
      "chart.js": `// Distributed Actor Mailbox Dispatcher
export class TelemetryActor extends Actor {
  private state: RingBuffer<TelemetryEvent>;

  async receive(msg: TelemetryPayload) {
    this.state.push(msg);
    if (this.state.isHot()) await this.mesh.flush();
  }
}`,
      "style.css": `/* Low latency state visualizer */
.actor-node.active {
  stroke: #22d3ee;
  filter: drop-shadow(0 0 8px #22d3ee);
}`,
      "index.html": `<!-- Actor Mesh Diagnostic Topo -->
<div id="mesh-nodes" data-active="6" data-sync="100%"></div>`,
    },
    note: "Voice dictation thread stream active at 280ms latency",
  },
  Coding: {
    label: "Coding",
    icon: Code2,
    prompt: "Implement a high-performance audio frequency visualizer with 60 FPS canvas loop and reactive damping filter.",
    routerTag: "Monaco Sandbox Runtime Specialist",
    latency: "0.35s latency",
    response: "Constructed dual-pass FFT analyzer with Web Audio API context and smoothed Bezier wave interpolator.",
    files: ["audio-visualizer.js", "math-dsp.ts"],
    badge: "Monaco V8",
    codeFiles: {
      "chart.js": `// Web Audio FFT Canvas Engine
const ctx = new AudioContext();
const analyzer = ctx.createAnalyser();
analyzer.fftSize = 256;

function drawFrame() {
  requestAnimationFrame(drawFrame);
  analyzer.getByteFrequencyData(freqData);
  renderSpline(freqData);
}`,
      "style.css": `canvas.spectrum {
  width: 100%;
  height: 100%;
  mix-blend-mode: screen;
}`,
      "index.html": `<canvas class="spectrum" id="fft-canvas"></canvas>`,
    },
    note: "Sandbox live in isolated iframe DOM context",
  },
  PDF: {
    label: "PDF",
    icon: FileText,
    prompt: "Extract debt covenant ratios, liquidity requirements, and credit risk factors from Section 4.2 of 10-K filing.",
    routerTag: "PDF Agent • Grounded Vector RAG",
    latency: "0.48s latency",
    response: "Extracted 3 primary vector chunks across pages 24-28. Fixed coverage ratio covenant identified at 2.75x minimum.",
    files: ["10-K_filing.pdf", "covenants.json"],
    badge: "Verified Vectors",
    codeFiles: {
      "chart.js": `// Grounded Vector Query Extraction
{
  "chunk_id": "vec_sec42_891",
  "document": "annual_filing_2025.pdf",
  "page": 24,
  "similarity": 0.948,
  "clause": "Fixed charge coverage ratio shall not fall below 2.75:1.00 at quarter-end."
}`,
      "style.css": `.citation-anchor {
  background: rgba(99, 102, 241, 0.15);
  border-left: 2px solid #818cf8;
}`,
      "index.html": `<div class="citation" data-page="24">Verified Citation</div>`,
    },
    note: "Grounded with 99.8% citation verification score",
  },
  PPT: {
    label: "PPT",
    icon: Presentation,
    prompt: "Structure a cohesive 6-slide executive keynote narrative on unified autonomous multi-agent architectures.",
    routerTag: "Keynote Presentation Architect",
    latency: "0.41s latency",
    response: "Generated narrative progression: Problem Statement → Neural Mesh → Latency Benchmarks → Live Telemetry Demo → Strategic ROI.",
    files: ["keynote_deck.pptx", "slide_notes.md"],
    badge: "Deck Generator",
    codeFiles: {
      "chart.js": `// Executive Keynote Deck Structure
export const slides = [
  { id: 1, title: "The Tool Fragmentation Crisis" },
  { id: 2, title: "The Autonomous Neural Mesh" },
  { id: 3, title: "Deterministic Sub-ms Routing" },
  { id: 4, title: "Enterprise Impact & ROI" }
];`,
      "style.css": `.slide-viewport {
  aspect-ratio: 16 / 9;
  letter-spacing: -0.02em;
}`,
      "index.html": `<section class="keynote-slide active">Slide 02 // Neural Mesh</section>`,
    },
    note: "Presenter speaker notes embedded automatically",
  },
  Vision: {
    label: "Vision",
    icon: ImageIcon,
    prompt: "Inspect network schematic diagram and verify whether ingress gateway connects directly to Redis cluster.",
    routerTag: "Spatial Multimodal Perception Agent",
    latency: "0.52s latency",
    response: "Optical layout analysis reveals ingress routes through Envoy sidecar before hitting cluster node replicas.",
    files: ["schematic.png", "optical-nodes.json"],
    badge: "Spatial Vision",
    codeFiles: {
      "chart.js": `// Spatial Coordinate Bounding Resolvers
const detectedTopology = {
  ingress_gateway: { x: 120, y: 84, w: 240, h: 90 },
  envoy_proxy:     { x: 390, y: 84, w: 180, h: 90 },
  state_cluster:   { x: 620, y: 140, w: 320, h: 220 }
};`,
      "style.css": `.bounding-box {
  outline: 1.5px dashed #06b6d4;
  background: rgba(6, 182, 212, 0.08);
}`,
      "index.html": `<svg viewBox="0 0 1000 600"><rect class="bounding-box"/></svg>`,
    },
    note: "Resolved 4 microservices with spatial node hierarchy",
  },
  Search: {
    label: "Search",
    icon: Globe,
    prompt: "Query real-time benchmarks and memory footprints for open-weights 120B reasoning models across mathematical proof tasks.",
    routerTag: "Autonomous Web Retrieval Specialist",
    latency: "0.58s latency",
    response: "Synthesized live results across arXiv preprints and HuggingFace leaderboards with verified citation links.",
    files: ["web_sources.json", "benchmark_matrix.csv"],
    badge: "Live Web",
    codeFiles: {
      "chart.js": `// Live Scholarly Search Synthesis
export const liveIndex = [
  { source: "arXiv:2502.10928", score: "88.4% MATH-500", tokens_sec: 42 },
  { source: "HuggingFace OpenLM", score: "91.2% GSM8k", tokens_sec: 38 }
];`,
      "style.css": `.source-pill {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}`,
      "index.html": `<ul class="source-list"><li>4 Sources Verified</li></ul>`,
    },
    note: "Indexed 4 verified academic sources in real time",
  },
};

export default function HeroSection({ onOpenAuth }) {
  const sectionRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headlineRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const frameRef = useRef(null);
  const atmosphereRef = useRef(null);

  // Active state
  const [activeAgentKey, setActiveAgentKey] = useState("Auto");
  const [activeFileTab, setActiveFileTab] = useState("chart.js");

  // 3D Tilt & Mouse Spotlight tracking
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  // Simulated live bar heights for telemetry
  const [barHeights, setBarHeights] = useState([40, 65, 30, 85, 95, 75, 60, 90, 100, 70, 85, 92]);
  const [liveFps, setLiveFps] = useState(60);

  const activeAgent = AGENT_MODES[activeAgentKey] || AGENT_MODES.Auto;

  // Animate telemetry bars dynamically
  useEffect(() => {
    const interval = setInterval(() => {
      setBarHeights((prev) =>
        prev.map((val) => {
          const delta = (Math.random() - 0.48) * 18;
          return Math.min(100, Math.max(25, Math.round(val + delta)));
        })
      );
      setLiveFps(Math.round(59 + Math.random() * 2));
    }, 450);
    return () => clearInterval(interval);
  }, []);

  // GSAP Entrance
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      gsap.set([eyebrowRef.current, headlineRef.current, subtitleRef.current, ctaRef.current, frameRef.current, atmosphereRef.current], {
        opacity: 1, y: 0, scale: 1,
      });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      gsap.set(eyebrowRef.current, { opacity: 0, y: 16 });
      gsap.set(headlineRef.current, { opacity: 0, y: 36 });
      gsap.set(subtitleRef.current, { opacity: 0, y: 24 });
      gsap.set(ctaRef.current, { opacity: 0, y: 20 });
      gsap.set(frameRef.current, { opacity: 0, y: 50, scale: 0.97 });
      gsap.set(atmosphereRef.current, { opacity: 0, scale: 1.08 });

      tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.8 }, 0.05)
        .to(headlineRef.current, { opacity: 1, y: 0, duration: 1.0 }, 0.2)
        .to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.85 }, 0.4)
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.75 }, 0.55)
        .to(atmosphereRef.current, { opacity: 0.65, scale: 1, duration: 1.6, ease: "power2.out" }, 0.4)
        .to(frameRef.current, { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out" }, 0.65);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Mouse Parallax Tilt
  const handleMouseMove = (e) => {
    if (!frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normX = (x / rect.width) * 2 - 1; // -1 to 1
    const normY = (y / rect.height) * 2 - 1; // -1 to 1

    setTilt({
      x: -normY * 4.5, // tilt up/down
      y: normX * 5.5,  // tilt left/right
    });

    setMousePos({
      x: Math.round((x / rect.width) * 100),
      y: Math.round((y / rect.height) * 100),
    });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <section
      id="overview"
      ref={sectionRef}
      className="relative pt-28 sm:pt-36 lg:pt-40 pb-20 sm:pb-32 overflow-hidden bg-white w-full"
    >
      {/* Editorial atmospheric aura using generated convergence visual */}
      <div
        ref={atmosphereRef}
        aria-hidden="true"
        className="absolute top-8 sm:top-4 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[560px] sm:h-[700px] -z-10 pointer-events-none select-none opacity-60 animate-pulseGlow"
      >
        <img
          src={koggentHeroAtmosphere}
          alt=""
          className="w-full h-full object-contain filter blur-[2px] [mask-image:radial-gradient(ellipse_80%_65%_at_50%_40%,#000_25%,transparent_80%)]"
          loading="eager"
          decoding="async"
        />
      </div>

      {/* Subtle radial fallback */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(99,102,241,0.06),transparent)] pointer-events-none"
      />

      {/* Centered Editorial Text Block */}
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center mb-12 sm:mb-16">
        <div ref={eyebrowRef} className="flex justify-center mb-5 sm:mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-100/90 border border-zinc-200/80 text-[11px] font-mono uppercase tracking-[0.2em] font-semibold text-zinc-600 select-none shadow-2xs hover:border-zinc-300 transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span>Autonomous Multi-Agent AI Workspace</span>
          </div>
        </div>

        {/* Level 01 — Hero Headline: clamp 88-120px desktop, tight leading */}
        <h1
          ref={headlineRef}
          className="text-[clamp(2.75rem,7.5vw,7.25rem)] font-bold text-zinc-950 tracking-[-0.04em] leading-[0.93] mb-6 sm:mb-7"
        >
          One workspace.<br />
          <span className="text-zinc-400 font-light italic">Multiple intelligences.</span>
        </h1>

        <p
          ref={subtitleRef}
          className="text-[17px] sm:text-xl text-zinc-600 font-normal leading-relaxed max-w-2xl mx-auto mb-8 sm:mb-10"
        >
          Koggent orchestrates conversational reasoning, live Monaco code sandboxing, vector RAG documents,
          spatial vision, and live web research within a unified neural mesh.
        </p>

        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            type="button"
            onClick={onOpenAuth}
            id="hero-launch-btn"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white font-medium text-sm transition-all duration-200 active:scale-[0.98] shadow-md hover:shadow-xl hover:shadow-zinc-950/10 cursor-pointer group"
          >
            <span>Launch Koggent Workspace</span>
            <ArrowRight size={14} className="text-zinc-400 group-hover:translate-x-1 transition-transform duration-200" />
          </button>

          <a
            href="#capabilities"
            onClick={(e) => {
              e.preventDefault();
              if (window.__lenis) {
                window.__lenis.scrollTo("#capabilities", { offset: -20 });
              } else {
                document.querySelector("#capabilities")?.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-4 rounded-full bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 hover:text-zinc-950 font-medium text-sm transition-colors duration-200 cursor-pointer shadow-2xs hover:shadow-sm"
          >
            Explore 6 Capabilities
          </a>
        </div>
      </div>

      {/* Hero Product Visual — Immersive 3D Tilt Command Center */}
      <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-14">
        <div
          ref={frameRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative w-full mx-auto transition-transform duration-150 ease-out will-change-transform"
          style={{
            transform: `perspective(1400px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.008 : 1})`,
          }}
        >
          {/* Ambient drop shadow / glow aura */}
          <div
            aria-hidden="true"
            className="absolute -top-16 left-1/2 -translate-x-1/2 w-4/5 h-52 bg-gradient-to-b from-indigo-500/15 via-cyan-400/8 to-transparent blur-3xl pointer-events-none -z-10"
          />

          {/* Interactive Mouse Spotlight Sheen */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none rounded-3xl z-30 opacity-70 transition-opacity duration-300"
            style={{
              background: `radial-gradient(700px circle at ${mousePos.x}% ${mousePos.y}%, rgba(255, 255, 255, 0.08), transparent 50%)`,
            }}
          />

          {/* Command Center Chassis */}
          <div className="relative p-1.5 sm:p-2.5 rounded-2xl sm:rounded-3xl bg-zinc-950/[0.04] border border-zinc-900/[0.08] shadow-2xl shadow-zinc-950/20 w-full">
            <div className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40 bg-[#0b0d13]">

              {/* Window Chrome Titlebar */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#08090d] border-b border-white/[0.08] select-none">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400 ml-3">
                    <img src={koggentLogo} alt="" className="w-3.5 h-3.5 object-contain opacity-80" />
                    <span className="text-zinc-300 font-medium">Koggent Workspace</span>
                    <span className="text-zinc-600">/</span>
                    <span className="text-indigo-400">{activeAgentKey} Agent Mode</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-zinc-400">
                    <Activity size={11} className="text-indigo-400 animate-pulse" />
                    <span>Neural Mesh Active</span>
                  </div>
                  <div className="text-[10px] tracking-wider uppercase font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Live 60 FPS</span>
                  </div>
                </div>
              </div>

              {/* Workspace content — Dynamic Command Center layout */}
              <div className="w-full min-h-[620px] sm:min-h-[700px] lg:h-[780px] xl:h-[820px] bg-[#0d0f14] text-slate-200 flex flex-row overflow-hidden select-none">

                {/* Left Navigation Sidebar */}
                <div className="hidden md:flex w-56 lg:w-64 xl:w-72 shrink-0 border-r border-white/[0.08] bg-[#090b0f] flex-col p-4 text-xs justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.06]">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white tracking-tight text-sm">Active Session</span>
                      </div>
                      <span className="text-[10px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded font-mono">v1.2</span>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-mono font-semibold px-2 mb-1">
                        Select Specialized Agent
                      </div>
                      {Object.keys(AGENT_MODES).map((key) => {
                        const ag = AGENT_MODES[key];
                        const Icon = ag.icon;
                        const isCurrent = activeAgentKey === key;
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setActiveAgentKey(key)}
                            className={`w-full px-3 py-2 rounded-lg text-left flex items-center justify-between transition-all duration-150 cursor-pointer ${
                              isCurrent
                                ? "bg-indigo-600/20 text-white border border-indigo-500/30 shadow-xs"
                                : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
                            }`}
                          >
                            <span className="flex items-center gap-2.5 truncate">
                              <Icon size={13} className={isCurrent ? "text-indigo-400" : "text-slate-500"} />
                              <span className="truncate text-xs font-medium">{key} Agent</span>
                            </span>
                            {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/[0.06] text-[11px] text-slate-500 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Activity size={12} className="text-emerald-400" />
                        <span>Mesh Latency</span>
                      </span>
                      <span className="font-mono text-emerald-400">1.1ms</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span>6 Agents Synced</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400/80" />
                    </div>
                  </div>
                </div>

                {/* Central Interactive Chat Area */}
                <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 lg:p-7 overflow-hidden">
                  {/* Mode Chips Toolbar — Fully Clickable */}
                  <div className="flex items-center gap-2 pb-3 overflow-x-auto [scrollbar-width:none]">
                    {Object.keys(AGENT_MODES).map((key) => {
                      const ag = AGENT_MODES[key];
                      const Icon = ag.icon;
                      const isActive = activeAgentKey === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setActiveAgentKey(key)}
                          className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 cursor-pointer ${
                            isActive
                              ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white border-transparent shadow-md shadow-indigo-500/20 scale-[1.03]"
                              : "bg-white/[0.04] text-slate-400 border-white/[0.08] hover:bg-white/[0.08] hover:text-white"
                          }`}
                        >
                          <Icon size={12} className={isActive ? "text-white" : "text-slate-400"} />
                          <span>{ag.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Dynamic Chat Messages Conversation Thread */}
                  <div className="flex-1 flex flex-col justify-center max-w-2xl xl:max-w-3xl mx-auto w-full my-auto space-y-4 py-3">
                    {/* User Prompt */}
                    <div className="self-end max-w-[85%] px-4 py-3 rounded-2xl rounded-tr-xs bg-indigo-600 text-white text-xs sm:text-sm leading-relaxed shadow-md animate-fadeIn">
                      {activeAgent.prompt}
                    </div>

                    {/* Specialist Agent Response Card */}
                    <div className="self-start max-w-[94%] p-4 sm:p-5 rounded-2xl rounded-tl-xs bg-white/[0.04] border border-white/[0.08] space-y-3 text-xs sm:text-sm shadow-xl backdrop-blur-md animate-fadeIn">
                      <div className="flex items-center justify-between text-xs text-indigo-300 font-mono pb-2 border-b border-white/[0.06]">
                        <div className="flex items-center gap-2">
                          <Zap size={13} className="text-cyan-400" />
                          <span>{activeAgent.routerTag}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{activeAgent.latency}</span>
                      </div>
                      <p className="text-slate-300 text-xs sm:text-[13px] leading-relaxed">
                        {activeAgent.response}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                        {activeAgent.files.map((file) => (
                          <span
                            key={file}
                            className="px-2.5 py-1 rounded bg-white/[0.05] text-indigo-300 border border-white/[0.08] font-mono text-[11px]"
                          >
                            {file}
                          </span>
                        ))}
                        <span className="ml-auto text-emerald-400 font-mono flex items-center gap-1 text-[10px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          {activeAgent.badge}
                        </span>
                      </div>
                    </div>

                    {/* Grounded Citation / Memory Bar */}
                    <div className="self-start max-w-[90%] p-3 rounded-xl bg-indigo-500/[0.07] border border-indigo-500/20 text-xs text-indigo-200 flex items-center justify-between animate-fadeIn">
                      <div className="flex items-center gap-2">
                        <FileText size={13} className="text-indigo-400 shrink-0" />
                        <span className="truncate">{activeAgent.note}</span>
                      </div>
                      <span className="font-mono text-[10px] text-indigo-300 shrink-0 ml-2">Verified</span>
                    </div>
                  </div>

                  {/* Interactive Input Bar */}
                  <div className="mt-2 rounded-2xl bg-white/[0.04] border border-white/[0.1] p-3 sm:p-3.5 flex items-center justify-between gap-3 text-xs text-slate-400 shadow-lg">
                    <div className="flex items-center gap-3 truncate">
                      <Mic size={15} className="text-slate-500 shrink-0" />
                      <span className="truncate text-slate-500">
                        Ask anything or switch intelligence modes above...
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-white/[0.06] text-slate-400 text-[10px] font-mono">
                        Enter ↵
                      </span>
                      <button
                        type="button"
                        onClick={onOpenAuth}
                        aria-label="Send prompt"
                        className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm cursor-pointer hover:bg-indigo-500 transition-colors"
                      >
                        <Send size={13} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Interactive Artifact & Telemetry Panel */}
                <div className="hidden lg:flex w-88 xl:w-96 2xl:w-[420px] shrink-0 border-l border-white/[0.08] bg-[#0a0c10] flex-col justify-between p-5 text-xs">
                  <div className="space-y-4">
                    {/* Panel Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] text-xs">
                      <div className="flex items-center gap-2 font-mono text-slate-200 font-semibold">
                        <Terminal size={14} className="text-violet-400" />
                        <span>Monaco Live Preview</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 font-mono text-[10px]">
                          V8 Engine
                        </span>
                        <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-mono">
                          live
                        </span>
                      </div>
                    </div>

                    {/* Interactive File Tabs */}
                    <div className="flex items-center gap-1 pb-1 border-b border-white/[0.04] text-[11px] font-mono">
                      {["chart.js", "style.css", "index.html"].map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setActiveFileTab(tab)}
                          className={`px-3 py-1 rounded-t font-medium transition-colors cursor-pointer ${
                            activeFileTab === tab
                              ? "bg-white/[0.08] text-white border-t border-l border-r border-white/[0.1]"
                              : "text-slate-500 hover:text-slate-300"
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    {/* Code View with Syntax Tokens */}
                    <div className="rounded-xl bg-black/70 border border-white/[0.06] p-3.5 font-mono text-[11px] text-slate-300 leading-relaxed overflow-hidden shadow-inner h-[180px] overflow-y-auto">
                      <pre className="whitespace-pre-wrap">
                        {activeAgent.codeFiles[activeFileTab] || activeAgent.codeFiles["chart.js"]}
                      </pre>
                    </div>

                    {/* Live Equalizer Telemetry Bars */}
                    <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-2.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono text-slate-400 uppercase tracking-wider text-[10px] font-semibold flex items-center gap-1.5">
                          <Activity size={11} className="text-cyan-400" />
                          <span>Streaming Telemetry</span>
                        </span>
                        <span className="text-emerald-400 font-mono text-[10px]">{liveFps} FPS</span>
                      </div>

                      {/* Equalizer Bars */}
                      <div className="h-18 w-full rounded-lg bg-black/50 border border-white/[0.05] p-2 flex items-end justify-between gap-1.5">
                        {barHeights.map((val, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-gradient-to-t from-indigo-600 via-violet-500 to-cyan-400 rounded-xs transition-all duration-300 opacity-80 hover:opacity-100"
                            style={{ height: `${val}%` }}
                          />
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>P99: 1.1ms</span>
                        <span>48.2k rps</span>
                        <span className="text-cyan-400">DOM Reactive</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] text-center font-mono mt-3 flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Browser V8 DOM Sandbox Synchronized</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
