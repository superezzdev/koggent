import { useState } from "react";
import {
  Code2,
  Eye,
  Copy,
  Check,
  ArrowRight,
} from "lucide-react";
import ProductFrame from "../components/ProductFrame";

export default function ArtifactShowcase({ onOpenAuth }) {
  const [activeTab, setActiveTab] = useState("preview"); // 'preview' | 'html' | 'css' | 'js'
  const [copied, setCopied] = useState(false);

  const sampleCode = {
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div id="app" class="dashboard-card">
    <header class="header">
      <h3>Active Task Pipeline</h3>
      <span class="badge">Running</span>
    </header>
    <div id="chart-container"></div>
  </div>
  <script src="script.js"></script>
</body>
</html>`,
    css: `.dashboard-card {
  background: #0f1118;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  color: #fff;
  font-family: system-ui, sans-serif;
}
.badge {
  background: rgba(99, 102, 241, 0.2);
  color: #818cf8;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 11px;
}`,
    js: `// Reactive DOM Sandbox Execution
const container = document.getElementById('chart-container');
const points = [24, 42, 38, 65, 59, 82, 95];

function renderMetrics() {
  console.log("Koggent Artifact Initialized", { points });
}
renderMetrics();`,
  };

  const handleCopy = () => {
    const textToCopy = sampleCode[activeTab] || sampleCode.html;
    navigator.clipboard?.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24 sm:py-32 lg:py-40 bg-white border-t border-zinc-200/70 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-24">
          <p className="text-xs uppercase tracking-[0.2em] font-bold text-indigo-600 mb-3 select-none">
            Interactive Artifacts
          </p>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-950 tracking-tight leading-[1.15] mb-5">
            Real code. Instant browser execution.
          </h2>

          <p className="text-base sm:text-lg text-zinc-600 font-normal leading-relaxed">
            When Koggent generates front-end applications, it organizes files into a clean
            Monaco editor environment with an embedded iframe DOM sandbox.
          </p>
        </div>

        {/* Artifact Showcase Frame */}
        <div className="max-w-5xl mx-auto">
          <ProductFrame
            label="[Koggent Artifact Engine: Monaco Code Editor + Live Preview]"
            subtitle="Full-Stack Sandbox"
            theme="dark"
            aspectRatio="aspect-[16/10] sm:aspect-[16/9.5]"
          >
            <div className="h-full w-full bg-[#0a0c10] flex flex-col font-sans select-none">
              {/* Tab Bar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#07080c] border-b border-white/[0.08] text-xs">
                <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none]">
                  <button
                    type="button"
                    onClick={() => setActiveTab("preview")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      activeTab === "preview"
                        ? "bg-white/[0.1] text-white border border-white/[0.12]"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                    }`}
                  >
                    <Eye size={13} className="text-emerald-400" />
                    <span>Live Preview</span>
                  </button>

                  <div className="w-px h-4 bg-white/10 mx-1" />

                  <button
                    type="button"
                    onClick={() => setActiveTab("html")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                      activeTab === "html"
                        ? "bg-white/[0.1] text-white border border-white/[0.12]"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                    }`}
                  >
                    <Code2 size={13} className="text-indigo-400" />
                    <span>index.html</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("css")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                      activeTab === "css"
                        ? "bg-white/[0.1] text-white border border-white/[0.12]"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                    }`}
                  >
                    <Code2 size={13} className="text-cyan-400" />
                    <span>style.css</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("js")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                      activeTab === "js"
                        ? "bg-white/[0.1] text-white border border-white/[0.12]"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                    }`}
                  >
                    <Code2 size={13} className="text-amber-400" />
                    <span>script.js</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {activeTab !== "preview" && (
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                      title="Copy code"
                      aria-label="Copy code"
                    >
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  )}
                  <span className="hidden sm:inline-block text-[11px] font-mono text-zinc-500">
                    Monaco v4.7
                  </span>
                </div>
              </div>

              {/* Tab Content Canvas */}
              <div className="flex-1 overflow-hidden relative">
                {activeTab === "preview" ? (
                  /* Live Preview Render Mock */
                  <div className="h-full w-full bg-[#0d0f14] p-6 sm:p-10 flex items-center justify-center">
                    <div className="w-full max-w-md p-6 rounded-2xl bg-[#141720] border border-white/[0.08] shadow-2xl space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                        <h4 className="text-sm font-semibold text-white">Active Task Pipeline</h4>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-medium">
                          Active Sandbox
                        </span>
                      </div>

                      <div className="h-28 rounded-xl bg-black/30 border border-white/[0.05] p-3 flex flex-col justify-end">
                        <div className="flex items-end justify-between h-16 gap-2">
                          {[35, 60, 45, 75, 55, 85, 92].map((height, i) => (
                            <div
                              key={i}
                              style={{ height: `${height}%` }}
                              className="flex-1 rounded-sm bg-gradient-to-t from-indigo-600 to-cyan-400"
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                        Dynamic interactive component rendered directly in browser runtime with live script bindings.
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Monaco Code Editor Mock */
                  <div className="h-full w-full bg-[#0b0d13] p-4 sm:p-6 font-mono text-xs text-zinc-300 overflow-y-auto leading-relaxed">
                    <pre className="text-zinc-300">
                      <code>{sampleCode[activeTab]}</code>
                    </pre>
                  </div>
                )}
              </div>

              {/* Bottom Status Bar */}
              <div className="px-4 py-2 bg-[#07080c] border-t border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Sandbox: Ready</span>
                </div>
                <div>UTF-8 • JavaScript / CSS3 / HTML5</div>
              </div>
            </div>
          </ProductFrame>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={onOpenAuth}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-950 text-white font-medium text-xs sm:text-sm hover:bg-zinc-800 transition-colors cursor-pointer shadow-sm"
            >
              <span>Build Artifacts in Koggent</span>
              <ArrowRight size={14} className="text-zinc-400" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
