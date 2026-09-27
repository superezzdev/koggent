import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MessageSquare, Code2, FileText, Presentation, ImageIcon, Globe, Activity, Cpu, ShieldCheck } from "lucide-react";
import AgentNetwork from "../three/AgentNetwork";

gsap.registerPlugin(ScrollTrigger);

const TOPOLOGY_AGENTS = [
  {
    id: "chat",
    name: "Chat Agent",
    tag: "Conversational Reasoning",
    metric: "Multi-turn context",
    icon: MessageSquare,
    color: "text-indigo-400",
    borderGlow: "group-hover:border-indigo-500/50 group-hover:shadow-indigo-500/10",
    pos: "top-4 left-4 sm:top-6 sm:left-8",
  },
  {
    id: "coding",
    name: "Coding Agent",
    tag: "Monaco DOM Sandbox",
    metric: "Multi-file V8 runtime",
    icon: Code2,
    color: "text-violet-400",
    borderGlow: "group-hover:border-violet-500/50 group-hover:shadow-violet-500/10",
    pos: "top-1/2 -translate-y-1/2 left-3 sm:left-6",
  },
  {
    id: "pdf",
    name: "PDF Agent",
    tag: "Vector RAG Citations",
    metric: "Page-grounded vectors",
    icon: FileText,
    color: "text-red-400",
    borderGlow: "group-hover:border-red-500/50 group-hover:shadow-red-500/10",
    pos: "bottom-4 left-4 sm:bottom-6 sm:left-8",
  },
  {
    id: "vision",
    name: "Vision Agent",
    tag: "Spatial Schematics",
    metric: "Multimodal optics",
    icon: ImageIcon,
    color: "text-cyan-400",
    borderGlow: "group-hover:border-cyan-500/50 group-hover:shadow-cyan-500/10",
    pos: "top-4 right-4 sm:top-6 sm:right-8",
  },
  {
    id: "search",
    name: "Search Agent",
    tag: "Live Web Grounding",
    metric: "Real-time index graph",
    icon: Globe,
    color: "text-emerald-400",
    borderGlow: "group-hover:border-emerald-500/50 group-hover:shadow-emerald-500/10",
    pos: "top-1/2 -translate-y-1/2 right-3 sm:right-6",
  },
  {
    id: "ppt",
    name: "PPT Agent",
    tag: "Keynote Presentation",
    metric: "Narrative slide decks",
    icon: Presentation,
    color: "text-amber-400",
    borderGlow: "group-hover:border-amber-500/50 group-hover:shadow-amber-500/10",
    pos: "bottom-4 right-4 sm:bottom-6 sm:right-8",
  },
];

/**
 * Chapter 02 — Architecture
 * Complete Typography & Visual Redesign:
 * - Breathless centered editorial typography with contrasting weights & subtle italics
 * - Expansive Autonomous Intelligence Topology Nexus Stage
 * - 3D dynamic specular Three.js core framed by 6 real interactive specialist agent cards
 */
export default function StorySection() {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const bodyRef = useRef(null);
  const stageRef = useRef(null);
  const [activeHoverId, setActiveHoverId] = useState(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      gsap.set([headlineRef.current, bodyRef.current, stageRef.current], { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(headlineRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.95,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headlineRef.current,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(bodyRef.current, {
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.12,
        scrollTrigger: {
          trigger: bodyRef.current,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(stageRef.current, {
        opacity: 0,
        y: 50,
        scale: 0.98,
        duration: 1.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: stageRef.current,
          start: "top 78%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 sm:py-32 overflow-hidden bg-white">
      {/* Top rule */}
      <div aria-hidden="true" className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-14 sm:mb-18">
        <div className="h-px bg-zinc-100" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* 1. Dramatic Editorial Typography Statement */}
        <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-100/90 border border-zinc-200/80 text-[11px] font-mono uppercase tracking-[0.2em] font-semibold text-zinc-600 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
              <span>02 / The Synthesis Architecture</span>
            </div>
          </div>

          <h2
            ref={headlineRef}
            className="text-[clamp(2.5rem,5.5vw,5.5rem)] font-bold text-zinc-950 tracking-[-0.04em] leading-[0.96] mb-6"
          >
            Different problems demand <br className="hidden sm:inline" />
            <span className="italic font-light text-zinc-400">different intelligence.</span>{" "}
            <span className="text-indigo-600 block sm:inline">Koggent brings them together.</span>
          </h2>

          <p
            ref={bodyRef}
            className="text-[17px] sm:text-xl text-zinc-600 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            No single model masters coding, document reasoning, presentation authoring, and real-time research equally.
            Koggent orchestrates six specialist agents into an autonomous neural mesh—sharing context without tool friction.
          </p>
        </div>

        {/* 2. Visual Centerpiece: Autonomous Multi-Agent Topology Nexus Stage */}
        <div ref={stageRef} className="w-full max-w-6xl mx-auto">
          <div className="relative p-1.5 sm:p-2.5 rounded-2xl sm:rounded-3xl bg-zinc-950/[0.04] border border-zinc-900/[0.08] shadow-2xl shadow-zinc-950/15">
            <div className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 bg-[#080a0f]">

              {/* Stage Titlebar */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-[#06070a] border-b border-white/[0.08] select-none z-20 relative">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                  </div>
                  <span className="text-zinc-500 font-mono text-[11px] ml-2 hidden sm:inline">
                    Topology Coordinator • Protocol v2.4
                  </span>
                </div>

                <div className="font-mono text-[11px] text-zinc-400 flex items-center gap-2">
                  <Cpu size={12} className="text-indigo-400" />
                  <span>Autonomous Neural Mesh</span>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>6 Agents Synced</span>
                </div>
              </div>

              {/* Dynamic 3D Topology Arena */}
              <div className="relative w-full h-[520px] sm:h-[580px] lg:h-[640px] flex items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,rgba(79,70,229,0.12),transparent_75%)]">

                {/* Subtle blueprint grid overlay */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"
                />

                {/* SVG Concentric Target Rings and Synaptic Vector Conduits */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none select-none opacity-40"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="50%" cy="50%" r="220" fill="none" stroke="rgba(99,102,241,0.15)" strokeWidth="1" strokeDasharray="4 6" />
                  <circle cx="50%" cy="50%" r="140" fill="none" stroke="rgba(6,182,212,0.18)" strokeWidth="1" />
                  <circle cx="50%" cy="50%" r="70" fill="none" stroke="rgba(129,140,248,0.25)" strokeWidth="1" strokeDasharray="2 4" />
                </svg>

                {/* Central High-Performance 3D Agent Network Canvas */}
                <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-auto">
                  <AgentNetwork
                    className="w-full h-full"
                    activeAgentId={activeHoverId}
                    onHoverAgent={(id) => setActiveHoverId(id)}
                  />
                </div>

                {/* The 6 Floating Specialist Agent Cards Constellation */}
                <div className="absolute inset-0 z-20 pointer-events-none p-3 sm:p-6">
                  {TOPOLOGY_AGENTS.map((agent) => {
                    const Icon = agent.icon;
                    const isHovered = activeHoverId === agent.id;
                    return (
                      <div
                        key={agent.id}
                        onMouseEnter={() => setActiveHoverId(agent.id)}
                        onMouseLeave={() => setActiveHoverId(null)}
                        className={`absolute ${agent.pos} pointer-events-auto group cursor-pointer transition-all duration-300`}
                      >
                        <div
                          className={`p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#0e111a]/85 backdrop-blur-md border border-white/[0.08] shadow-xl transition-all duration-200 ${
                            agent.borderGlow
                          } ${isHovered ? "scale-105 border-white/30 bg-[#121624]" : "hover:border-white/20"}`}
                        >
                          <div className="flex items-center gap-2.5 mb-1.5">
                            <div className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center shrink-0">
                              <Icon size={14} className={agent.color} />
                            </div>
                            <div>
                              <h4 className="text-white text-xs font-semibold tracking-tight">{agent.name}</h4>
                              <p className="text-[10px] text-zinc-400 font-mono">{agent.tag}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-3 pt-1 border-t border-white/[0.04] text-[9px] font-mono text-zinc-500">
                            <span>{agent.metric}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Central Luminous Label */}
                <div className="absolute z-20 bottom-14 sm:bottom-16 left-1/2 -translate-x-1/2 pointer-events-none select-none text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[11px] font-mono shadow-lg shadow-indigo-950/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                    <span>Autonomous Central Routing Nexus</span>
                  </div>
                </div>
              </div>

              {/* Bottom Telemetry Bar */}
              <div className="px-5 sm:px-8 py-3.5 border-t border-white/[0.06] bg-[#06070a] grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] text-zinc-400 font-mono select-none">
                <div className="flex items-center justify-center gap-1.5 p-1.5 rounded-lg bg-white/[0.02]">
                  <Activity size={12} className="text-indigo-400" />
                  <span>Context Loss: <strong className="text-white">0ms</strong></span>
                </div>
                <div className="flex items-center justify-center gap-1.5 p-1.5 rounded-lg bg-white/[0.02]">
                  <Cpu size={12} className="text-cyan-400" />
                  <span>Routing: <strong className="text-white">Deterministic</strong></span>
                </div>
                <div className="flex items-center justify-center gap-1.5 p-1.5 rounded-lg bg-white/[0.02]">
                  <ShieldCheck size={12} className="text-emerald-400" />
                  <span>Memory: <strong className="text-white">Unified Mesh</strong></span>
                </div>
                <div className="flex items-center justify-center gap-1.5 p-1.5 rounded-lg bg-white/[0.02]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Cross-Agent Latency: <strong className="text-emerald-400">1.2ms</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
