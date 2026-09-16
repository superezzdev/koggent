import {
  Check,
  Code2,
  Copy,
  Eye,
  Maximize2,
  Minimize2,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { easeInOut, motion } from "motion/react";
import Editor from "@monaco-editor/react";

const DEFAULT_WIDTH = 500;
const MIN_WIDTH = 340;

function Artifact() {
  const [collapsed, setCollapsed] = useState(false);
  const { artifacts = [] } = useSelector((state) => state.message) || {};
  const [tab, setTab] = useState("code");
  const [activeFile, setActiveFile] = useState(0);
  const [copied, setCopied] = useState(false);

  // Flexible width state
  const [panelWidth, setPanelWidth] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("koggent_artifact_width");
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= MIN_WIDTH) {
          return parsed;
        }
      }
    }
    return DEFAULT_WIDTH;
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const preMaximizeWidthRef = useRef(panelWidth);

  const currentArtifact = artifacts?.[0];
  const files = currentArtifact?.files || [];
  const safeActiveFile = activeFile < files.length ? activeFile : 0;
  const file = files[safeActiveFile];

  const htmlFile = files.find((f) => f?.name === "index.html");
  const cssFile = files.find((f) => f?.name === "style.css");
  const jsFile = files.find((f) => f?.name === "script.js");

  const canPreview = Boolean(htmlFile);

  const previewDoc = (() => {
    if (!htmlFile?.content) return "";
    let content = htmlFile.content;
    const styleTag = cssFile?.content ? `<style>\n${cssFile.content}\n</style>` : "";
    const scriptTag = jsFile?.content ? `<script>\n${jsFile.content}\n</script>` : "";

    if (content.includes("</head>")) {
      content = content.replace("</head>", `${styleTag}\n</head>`);
    } else if (styleTag) {
      content = `${styleTag}\n${content}`;
    }

    if (content.includes("</body>")) {
      content = content.replace("</body>", `${scriptTag}\n</body>`);
    } else if (scriptTag) {
      content = `${content}\n${scriptTag}`;
    }

    return content;
  })();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(file?.content || "");
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const detectLanguage = (fileName = "") => {
    const name = fileName.toLowerCase();

    if (name.endsWith(".html")) return "html";
    if (name.endsWith(".css")) return "css";
    if (name.endsWith(".js")) return "javascript";
    if (name.endsWith(".jsx")) return "javascript";
    if (name.endsWith(".ts")) return "typescript";
    if (name.endsWith(".tsx")) return "typescript";
    if (name.endsWith(".json")) return "json";
    if (name.endsWith(".py")) return "python";
    if (name.endsWith(".java")) return "java";
    if (name.endsWith(".cpp")) return "cpp";
    if (name.endsWith(".c")) return "c";

    return "plaintext";
  };

  // Drag-to-resize handlers
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const windowWidth = window.innerWidth;
      const maxW = Math.max(MIN_WIDTH, windowWidth - 360);
      const newWidth = Math.min(Math.max(windowWidth - e.clientX, MIN_WIDTH), maxW);
      setPanelWidth(newWidth);
      setIsMaximized(false);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // Persist preferred width to localStorage
  useEffect(() => {
    if (!isDragging && panelWidth >= MIN_WIDTH) {
      localStorage.setItem("koggent_artifact_width", String(panelWidth));
    }
  }, [panelWidth, isDragging]);

  // Handle window resize boundary clamping
  useEffect(() => {
    const handleResize = () => {
      setPanelWidth((prev) => {
        const maxW = Math.max(MIN_WIDTH, window.innerWidth - 360);
        return Math.min(prev, maxW);
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleToggleMaximize = () => {
    if (isMaximized) {
      setPanelWidth(preMaximizeWidthRef.current || DEFAULT_WIDTH);
      setIsMaximized(false);
    } else {
      preMaximizeWidthRef.current = panelWidth;
      const maxW = Math.max(MIN_WIDTH, window.innerWidth - 360);
      setPanelWidth(maxW);
      setIsMaximized(true);
    }
  };

  const handleResetWidth = () => {
    setPanelWidth(DEFAULT_WIDTH);
    setIsMaximized(false);
  };

  if (!artifacts || artifacts.length === 0) return null;

  return (
    <motion.div
      initial={false}
      animate={{ width: collapsed ? 48 : panelWidth }}
      transition={
        isDragging
          ? { duration: 0 }
          : { duration: 0.25, ease: easeInOut }
      }
      style={{ width: collapsed ? 48 : panelWidth }}
      className={`hidden lg:flex h-full border-l border-white/[0.06] flex-col overflow-hidden shrink-0 relative ${
        isDragging ? "select-none" : ""
      }`}
    >
      {/* Fullscreen overlay during dragging to prevent iframe/monaco stealing mouse events */}
      {isDragging && (
        <div className="fixed inset-0 z-50 cursor-col-resize select-none pointer-events-auto" />
      )}

      {/* Resize handle */}
      {!collapsed && (
        <div
          onMouseDown={handleMouseDown}
          onDoubleClick={handleResetWidth}
          title="Drag to resize width (Double-click to reset)"
          className={`absolute top-0 bottom-0 left-0 w-3 -translate-x-1.5 z-30 cursor-col-resize select-none flex items-center justify-center group ${
            isDragging ? "pointer-events-auto" : ""
          }`}
        >
          {/* Vertical highlight line */}
          <div
            className={`w-[2px] h-full transition-colors duration-150 ${
              isDragging
                ? "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                : "bg-transparent group-hover:bg-indigo-500/70"
            }`}
          />
          {/* Pill handle indicator */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-1 h-8 rounded-full transition-all duration-150 pointer-events-none ${
              isDragging
                ? "bg-indigo-400 opacity-100 scale-y-110"
                : "bg-white/20 group-hover:bg-indigo-400 group-hover:opacity-100 opacity-0"
            }`}
          />
        </div>
      )}

      {/* Width indicator tooltip while dragging */}
      {isDragging && (
        <div className="absolute top-3 left-3 z-40 px-2.5 py-1 bg-[#13151c] border border-indigo-500/30 rounded-md text-[11px] font-mono text-indigo-300 shadow-xl pointer-events-none flex items-center gap-1.5">
          <span>Width:</span>
          <span className="font-semibold text-white">{Math.round(panelWidth)}px</span>
        </div>
      )}

      {!collapsed ? (
        <div className="flex flex-col h-full bg-[#0d0f14]">
          {/* Header */}
          <div className="h-14 px-4 border-b border-white/[0.06] flex items-center gap-3 shrink-0">
            <button
              className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer shrink-0"
              onClick={() => setCollapsed(true)}
              title="Collapse panel"
            >
              <PanelRightClose size={16} />
            </button>

            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="flex items-center justify-center w-6 h-6 rounded-md bg-indigo-500/10 border border-indigo-500/20 shrink-0">
                <Code2 className="text-indigo-400" size={12} />
              </div>

              <div className="text-[13px] font-medium text-slate-200 truncate">
                {artifacts[0]?.title}
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                className="flex items-center justify-center w-7 h-7 text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] rounded-lg transition-colors duration-150 bg-transparent border-none cursor-pointer"
                onClick={handleToggleMaximize}
                title={isMaximized ? "Restore width" : "Maximize width"}
              >
                {isMaximized ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              </button>

              <button
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] rounded-lg transition-colors duration-150 bg-transparent border-none cursor-pointer"
                onClick={handleCopy}
                title="Copy code"
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
              </button>
            </div>
          </div>

          {/* Code / Preview tabs */}
          {canPreview && (
            <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.06] p-1 mx-3 my-2 rounded-lg shrink-0">
              <button
                onClick={() => setTab("code")}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors duration-150 cursor-pointer ${
                  tab === "code"
                    ? "bg-indigo-500 text-white"
                    : "text-slate-500 hover:text-slate-200"
                }`}
              >
                <Code2 size={11} />
                Code
              </button>

              <button
                onClick={() => setTab("preview")}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors duration-150 cursor-pointer ${
                  tab === "preview"
                    ? "bg-indigo-500 text-white"
                    : "text-slate-500 hover:text-slate-200"
                }`}
              >
                <Eye size={11} />
                Preview
              </button>
            </div>
          )}

          {tab === "code" && (
            <div className="flex h-auto border-b border-white/[0.06] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink-0">
              {files.map((f, index) => (
                <button
                  key={index}
                  onClick={() => setActiveFile(index)}
                  className={`px-4 py-2.5 text-[11px] font-medium whitespace-nowrap transition-colors duration-150 border-r border-white/[0.05] relative cursor-pointer bg-transparent ${
                    safeActiveFile === index
                      ? "text-indigo-400"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {f?.name}

                  {safeActiveFile === index && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-500 rounded-t-full" />
                  )}
                </button>
              ))}
            </div>
          )}

          <div className="flex-1 overflow-hidden">
            {tab === "preview" && canPreview ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full"
              >
                <iframe
                  title="preview"
                  srcDoc={previewDoc}
                  sandbox="allow-scripts"
                  className="w-full h-full bg-white"
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full overflow-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                <Editor
                  theme="vs-dark"
                  language={detectLanguage(file?.name)}
                  value={file?.content}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 13,
                    wordWrap: "on",
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    padding: { top: 16 },
                    lineNumbers: "on",
                    renderLineHighlight: "none",
                  }}
                />
              </motion.div>
            )}
          </div>
        </div>
      ) : (
        /* Collapsed */
        <div className="hidden lg:flex h-full bg-[#0d0f14] flex-col items-center py-4 gap-3 shrink-0">
          <button
            className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer shrink-0"
            onClick={() => setCollapsed(false)}
            title="Expand artifact"
          >
            <PanelRightOpen size={16} />
          </button>

          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div
              className="text-[10px] font-medium text-slate-600 tracking-widest uppercase whitespace-nowrap"
              style={{
                writingMode: "vertical-lr",
                transform: "rotate(180deg)",
              }}
            >
              {artifacts[0]?.title}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default Artifact;
