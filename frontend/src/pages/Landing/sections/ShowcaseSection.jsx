import { useState } from "react";
import {
  Code2,
  FileText,
  Globe,
  Sparkles,
  ArrowRight,
  Check,
} from "lucide-react";
import LoadingAnimation from "../../../components/LoadingAnimation";
import ProductFrame from "../components/ProductFrame";

export default function ShowcaseSection({ onOpenAuth }) {
  const [activeTab, setActiveTab] = useState("coding");

  const showcaseModes = [
    {
      id: "coding",
      label: "Live Code Generation",
      icon: Code2,
      prompt: "Build an interactive cryptocurrency price visualizer with live SVG charts.",
      agentTag: "Coding Agent • Monaco Sandbox",
      resultTitle: "Cryptocurrency Real-time Visualizer (Multi-file Artifact)",
      resultSnippet:
        "Generated index.html, style.css, and script.js with reactive price tick calculations and responsive SVG line chart.",
    },
    {
      id: "rag",
      label: "Document Synthesis",
      icon: FileText,
      prompt: "Extract all risk factors and capital reserve covenants from Section 4.2 of the PDF.",
      agentTag: "PDF Agent • Vector RAG",
      resultTitle: "Risk Factor Matrix & Financial Covenants",
      resultSnippet:
        "Retrieved 3 vector chunks from pages 24-26. Extracted liquidity coverage ratios and structured key debt covenant obligations.",
    },
    {
      id: "search",
      label: "Real-Time Verification",
      icon: Globe,
      prompt: "Search current benchmarks and technical release notes for open-weights 120B reasoning models.",
      agentTag: "Search Agent • Web Retrieval",
      resultTitle: "Live Benchmark Synthesis & Documentation Sources",
      resultSnippet:
        "Autonomous query dispatched across live developer docs. Compiled throughput speeds and memory requirements with verified URLs.",
    },
  ];

  const currentMode = showcaseModes.find((m) => m.id === activeTab) || showcaseModes[0];

  return (
    <section id="experience" className="py-24 sm:py-32 lg:py-40 bg-[#050507] text-white overflow-hidden relative">
      {/* Subtle Radial Glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-indigo-500/15 via-purple-500/10 to-transparent blur-3xl pointer-events-none -z-0"
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Editorial Heading */}
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.08] border border-white/[0.12] text-xs font-semibold text-cyan-300 mb-5 select-none">
            <Sparkles size={13} />
            <span>Koggent in Action</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
            Work across modes without leaving your workspace.
          </h2>

          <p className="text-base sm:text-lg text-zinc-400 font-normal leading-relaxed max-w-2xl mx-auto">
            Switch effortlessly between asking questions, analyzing uploaded documents,
            building live code artifacts, and validating findings against the live internet.
          </p>

          {/* Interactive Mode Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8">
            {showcaseModes.map((mode) => {
              const Icon = mode.icon;
              const isActive = activeTab === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setActiveTab(mode.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-white text-zinc-950 border-white shadow-md shadow-white/10"
                      : "bg-white/[0.04] text-zinc-400 border-white/[0.08] hover:bg-white/[0.08] hover:text-white"
                  }`}
                >
                  <Icon size={14} className={isActive ? "text-zinc-950" : "text-zinc-400"} />
                  <span>{mode.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Large Dark Architectural Interface Container */}
        <div className="max-w-5xl mx-auto">
          <ProductFrame
            label="[Koggent Live Workspace Experience]"
            subtitle="Deep Mode Execution"
            theme="dark"
            aspectRatio="aspect-[16/10] sm:aspect-[16/9]"
            className="border-white/[0.12] bg-[#0d0f14]"
          >
            <div className="h-full w-full bg-[#0d0f14] p-5 sm:p-8 flex flex-col justify-between select-none">
              {/* Context Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-xs font-semibold text-white tracking-wide">
                    {currentMode.agentTag}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-zinc-500">
                  Execution State: Verified
                </span>
              </div>

              {/* Dynamic Interactive Preview Canvas */}
              <div className="my-auto py-4 space-y-5 max-w-3xl mx-auto w-full">
                {/* User Prompt */}
                <div className="flex justify-end">
                  <div className="max-w-[85%] sm:max-w-[75%] px-4 py-2.5 rounded-2xl rounded-tr-xs bg-indigo-600 text-white text-xs sm:text-sm leading-relaxed shadow-sm">
                    {currentMode.prompt}
                  </div>
                </div>

                {/* Real Koggent Loading / Reasoning Thought Component */}
                <div className="flex justify-start">
                  <div className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <LoadingAnimation />
                  </div>
                </div>

                {/* Agent Response Card */}
                <div className="flex justify-start">
                  <div className="max-w-[95%] sm:max-w-[88%] p-4 sm:p-5 rounded-2xl rounded-tl-xs bg-white/[0.04] border border-white/[0.1] text-xs sm:text-sm text-zinc-300 space-y-2.5 shadow-xl">
                    <div className="flex items-center justify-between text-xs pb-1.5 border-b border-white/[0.06]">
                      <span className="font-semibold text-white tracking-tight flex items-center gap-1.5">
                        <Check size={14} className="text-cyan-400" />
                        {currentMode.resultTitle}
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                        Active
                      </span>
                    </div>
                    <p className="text-zinc-300 text-xs sm:text-[13px] leading-relaxed">
                      {currentMode.resultSnippet}
                    </p>
                  </div>
                </div>
              </div>

              {/* Four Architectural Capability Badges */}
              <div className="pt-4 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-[11px] text-zinc-400 font-mono">
                <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  Multi-Agent Routing
                </div>
                <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  Live Monaco Sandbox
                </div>
                <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  Vector Document RAG
                </div>
                <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  Real-Time Web Search
                </div>
              </div>
            </div>
          </ProductFrame>

          {/* Quick Action below dark container */}
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={onOpenAuth}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-zinc-950 font-semibold text-xs sm:text-sm hover:bg-zinc-200 transition-colors cursor-pointer shadow-lg shadow-white/10"
            >
              <span>Test This Experience In Koggent</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
