
/**
 * ProductFrame provides an intentional, production-ready placeholder
 * system for Koggent workspace visuals and screenshots.
 * Designed to easily be replaced with actual image assets later
 * without altering container dimensions or layout rhythm.
 */
export default function ProductFrame({
  label = "Koggent Product Preview",
  subtitle = "Interactive Workspace",
  aspectRatio = "aspect-[16/10]",
  children,
  className = "",
  theme = "light", // 'light' | 'dark'
}) {
  const isDark = theme === "dark";

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border shadow-xl transition-all duration-300 ${
        isDark
          ? "bg-[#0b0d13] border-white/[0.1] shadow-black/60"
          : "bg-white border-zinc-200/80 shadow-zinc-200/50"
      } ${className}`}
    >
      {/* Window Titlebar */}
      <div
        className={`flex items-center justify-between px-4 py-3 border-b text-xs select-none ${
          isDark
            ? "bg-[#08090d] border-white/[0.08] text-zinc-400"
            : "bg-zinc-50/90 border-zinc-200/70 text-zinc-500"
        }`}
      >
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 inline-block" />
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] tracking-tight">
          <span className="truncate max-w-[200px] sm:max-w-none">{label}</span>
        </div>

        <div className="text-[10px] tracking-wider uppercase font-semibold text-zinc-400/80">
          {subtitle}
        </div>
      </div>

      {/* Frame Content Canvas */}
      <div className={`relative w-full ${aspectRatio} overflow-hidden flex flex-col`}>
        {children}
      </div>
    </div>
  );
}
