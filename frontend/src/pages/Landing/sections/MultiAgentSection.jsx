import {
  MessageSquare,
  Code2,
  FileText,
  Presentation,
  ImageIcon,
  Globe,
  Zap,
} from "lucide-react";
import koggentLogo from "../../../assets/brand/koggent-logo.png";

export default function MultiAgentSection() {
  const agents = [
    {
      name: "Chat Agent",
      role: "Reasoning & Dialogue",
      icon: MessageSquare,
      accent: "text-indigo-600 bg-indigo-50 border-indigo-200",
      description: "General conceptual inquiry, strategy, learning, and synthesis.",
    },
    {
      name: "Coding Agent",
      role: "Full-Stack Development",
      icon: Code2,
      accent: "text-violet-600 bg-violet-50 border-violet-200",
      description: "Multi-file application generation, refactoring, and sandbox previews.",
    },
    {
      name: "PDF Agent",
      role: "Document Intelligence",
      icon: FileText,
      accent: "text-red-600 bg-red-50 border-red-200",
      description: "Grounded Retrieval-Augmented Generation (RAG) over uploaded documents.",
    },
    {
      name: "PPT Agent",
      role: "Presentation Generation",
      icon: Presentation,
      accent: "text-amber-600 bg-amber-50 border-amber-200",
      description: "Automated slide outlines, narratives, and presentation structures.",
    },
    {
      name: "Vision Agent",
      role: "Image & Visual Analysis",
      icon: ImageIcon,
      accent: "text-cyan-600 bg-cyan-50 border-cyan-200",
      description: "Visual inspection, UI diagram understanding, and multimodal analysis.",
    },
    {
      name: "Search Agent",
      role: "Autonomous Web Research",
      icon: Globe,
      accent: "text-emerald-600 bg-emerald-50 border-emerald-200",
      description: "Live internet queries with grounded citations and source verification.",
    },
  ];

  return (
    <section className="py-24 sm:py-32 lg:py-40 bg-zinc-50/70 border-t border-zinc-200/70 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-24">
          <p className="text-xs uppercase tracking-[0.2em] font-bold text-indigo-600 mb-3 select-none">
            Coordinated Architecture
          </p>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-950 tracking-tight leading-[1.15] mb-5">
            One router. <br className="hidden sm:inline" />
            Specialized agent execution.
          </h2>

          <p className="text-base sm:text-lg text-zinc-600 font-normal leading-relaxed">
            When you submit a prompt or file, Koggent&apos;s router classifies the intent
            and delegates execution to the agent tuned for the domain.
          </p>
        </div>

        {/* Central Composition Diagram */}
        <div className="relative max-w-4xl mx-auto">
          {/* Central Koggent Hub */}
          <div className="flex flex-col items-center justify-center text-center relative z-10 mb-12 sm:mb-16">
            <div className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white border border-zinc-200 shadow-xl p-5 mb-4 group transition-transform duration-300 hover:scale-105">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-cyan-500/10 via-purple-500/10 to-indigo-500/10 -z-10 blur-sm" />
              <img
                src={koggentLogo}
                alt="Koggent Core Router"
                className="w-full h-full object-contain select-none"
              />
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900 text-white text-xs font-semibold tracking-wide shadow-xs">
              <Zap size={12} className="text-cyan-400" />
              <span>Koggent Multi-Agent Router</span>
            </div>

            <p className="text-xs text-zinc-500 mt-2 font-mono">
              Auto intent classification &amp; multimodal file dispatch
            </p>
          </div>

          {/* SVG Connecting Flow Lines (Hidden on mobile for clean vertical stack) */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute top-28 left-0 right-0 h-24 pointer-events-none -z-0"
          >
            <svg
              className="w-full h-full text-zinc-300"
              viewBox="0 0 800 100"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M 400 0 L 400 30 C 400 50, 130 50, 130 100"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <path
                d="M 400 0 L 400 30 C 400 50, 400 50, 400 100"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <path
                d="M 400 0 L 400 30 C 400 50, 670 50, 670 100"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            </svg>
          </div>

          {/* Specialized Agent Nodes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 pt-4">
            {agents.map((agent) => {
              const Icon = agent.icon;
              return (
                <div
                  key={agent.name}
                  className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-xs hover:shadow-md hover:border-zinc-300 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center border ${agent.accent}`}
                      >
                        <Icon size={18} />
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                        Specialized
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-zinc-900 tracking-tight mb-1">
                      {agent.name}
                    </h3>

                    <p className="text-xs font-semibold text-indigo-600 mb-2.5">
                      {agent.role}
                    </p>

                    <p className="text-xs text-zinc-600 leading-relaxed font-normal">
                      {agent.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-5 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                    <span>Status: Available</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
