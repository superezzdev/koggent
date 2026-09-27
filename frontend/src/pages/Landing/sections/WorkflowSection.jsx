import { MessageSquareText, GitBranch, Cpu, Sparkles } from "lucide-react";

export default function WorkflowSection() {
  const steps = [
    {
      step: "01",
      title: "Input or Attach",
      description:
        "Type your prompt, speak directly using voice dictation, or attach PDF documents and images for analysis.",
      icon: MessageSquareText,
    },
    {
      step: "02",
      title: "Intent Routing",
      description:
        "Koggent evaluates your request and assigns the task to the right agent—or follows your explicitly selected mode.",
      icon: GitBranch,
    },
    {
      step: "03",
      title: "Autonomous Execution",
      description:
        "The specialized agent reasons through the problem, queries live web sources, extracts document data, or writes code.",
      icon: Cpu,
    },
    {
      step: "04",
      title: "Actionable Results",
      description:
        "Review comprehensive answers, cited web evidence, structured slide decks, or live interactive Monaco code artifacts.",
      icon: Sparkles,
    },
  ];

  return (
    <section className="py-24 sm:py-32 lg:py-40 bg-zinc-50/60 border-t border-zinc-200/70 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-24">
          <p className="text-xs uppercase tracking-[0.2em] font-bold text-indigo-600 mb-3 select-none">
            Streamlined Flow
          </p>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-950 tracking-tight leading-[1.15] mb-5">
            How Koggent works.
          </h2>

          <p className="text-base sm:text-lg text-zinc-600 font-normal leading-relaxed">
            From the initial question to a complete application artifact in four clear stages.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative p-6 sm:p-7 rounded-2xl bg-white border border-zinc-200/80 shadow-xs hover:shadow-md hover:border-zinc-300 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded">
                      STEP {item.step}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600">
                      <Icon size={16} />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-zinc-900 tracking-tight mb-2.5">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-zinc-100 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span>Phase {idx + 1}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
