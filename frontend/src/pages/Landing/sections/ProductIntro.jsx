import { ArrowUpRight } from "lucide-react";

export default function ProductIntro() {
  const pillars = [
    {
      title: "Zero Context Switching",
      description:
        "Execute code, extract insights from complex PDFs, craft presentations, and verify facts with live web search in the same conversational session.",
      badge: "Unified Canvas",
    },
    {
      title: "Intelligent Agent Routing",
      description:
        "Koggent evaluates incoming prompts, files, and intents to automatically assign tasks to the optimal agent capability or follow your explicit mode selection.",
      badge: "Dynamic Router",
    },
    {
      title: "Tangible Code Artifacts",
      description:
        "Code output is not just static markdown text. It is structured into multi-file projects with live browser rendering and full Monaco editor inspection.",
      badge: "Monaco Sandbox",
    },
  ];

  return (
    <section className="relative py-24 sm:py-32 lg:py-40 bg-zinc-50/60 border-y border-zinc-200/70 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Editorial Statement */}
        <div className="max-w-4xl mx-auto text-center mb-20 sm:mb-28">
          <p className="text-xs uppercase tracking-[0.2em] font-bold text-indigo-600 mb-4 select-none">
            Architectural Philosophy
          </p>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-950 tracking-tight leading-[1.25] sm:leading-[1.2]">
            Modern problem-solving demands multiple cognitive skills. Koggent organizes
            specialized intelligences into a single cohesive workspace.
          </h2>

          <p className="mt-6 sm:mt-8 text-base sm:text-lg text-zinc-600 leading-relaxed max-w-2xl mx-auto font-normal">
            Rather than jumping across fragmented tools for coding, document reading,
            slide drafting, and internet research, Koggent bridges these workflows into
            one continuous thread.
          </p>
        </div>

        {/* 3 Editorial Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
          {pillars.map((pillar, idx) => (
            <div
              key={pillar.title}
              className="relative flex flex-col justify-between p-8 rounded-2xl bg-white border border-zinc-200/90 shadow-xs hover:border-zinc-300 hover:shadow-md transition-all duration-200"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-xs font-semibold text-zinc-400">
                    0{idx + 1}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 text-[11px] font-medium text-zinc-600 border border-zinc-200">
                    {pillar.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-zinc-900 tracking-tight mb-3">
                  {pillar.title}
                </h3>

                <p className="text-sm text-zinc-600 leading-relaxed font-normal">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-zinc-100 flex items-center justify-between text-xs font-medium text-zinc-500">
                <span>Verified System Architecture</span>
                <ArrowUpRight size={14} className="text-zinc-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
