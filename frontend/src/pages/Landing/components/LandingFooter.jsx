import koggentLogo from "../../../assets/brand/koggent-logo.png";

export default function LandingFooter({ onOpenLegal, onOpenAuth }) {
  const currentYear = new Date().getFullYear();

  const handleScrollTo = (e, href) => {
    e.preventDefault();
    if (window.__lenis) {
      window.__lenis.scrollTo(href, { offset: -20 });
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-zinc-950 text-white border-t border-zinc-800/80 overflow-hidden relative">
      {/* Subtle watermark */}
      <div
        aria-hidden="true"
        className="absolute -bottom-8 right-0 select-none pointer-events-none opacity-[0.025] text-[16vw] font-black tracking-tighter leading-none"
      >
        KOGGENT
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 relative z-10">
        {/* Main footer row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-zinc-800/80">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <img src={koggentLogo} alt="Koggent Logo" className="w-7 h-7 object-contain" />
            <span className="text-base font-bold tracking-tight text-white">Koggent</span>
            <span className="hidden sm:inline text-xs text-zinc-600 font-mono ml-2">Multi-Agent AI Workspace</span>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
            <a href="#overview" onClick={(e) => handleScrollTo(e, "#overview")} className="hover:text-white transition-colors">Overview</a>
            <a href="#capabilities" onClick={(e) => handleScrollTo(e, "#capabilities")} className="hover:text-white transition-colors">Capabilities</a>
            <a href="#experience" onClick={(e) => handleScrollTo(e, "#experience")} className="hover:text-white transition-colors">Experience</a>
            <div aria-hidden="true" className="w-px h-3 bg-zinc-700 hidden sm:block" />
            <button type="button" onClick={() => onOpenLegal("about")} className="hover:text-white transition-colors cursor-pointer">About</button>
            <button type="button" onClick={() => onOpenLegal("terms")} className="hover:text-white transition-colors cursor-pointer">Terms</button>
            <button type="button" onClick={() => onOpenLegal("privacy")} className="hover:text-white transition-colors cursor-pointer">Privacy</button>
            <button type="button" onClick={() => onOpenLegal("security")} className="hover:text-white transition-colors cursor-pointer">Security</button>
          </nav>

          {/* Auth link */}
          <button
            type="button"
            onClick={onOpenAuth}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer shrink-0"
          >
            Access Workspace →
          </button>
        </div>

        {/* Bottom row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-600">
          <p>© {currentYear} Koggent Inc. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => onOpenLegal("cookies")} className="hover:text-zinc-400 transition-colors cursor-pointer">Cookies</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
