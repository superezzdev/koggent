import { useState, useEffect } from "react";
import { ArrowRight, Menu, X, Download, Check } from "lucide-react";
import koggentLogo from "../../../assets/brand/koggent-logo.png";
import { usePWAInstall } from "../../../hooks/usePWAInstall";

export default function LandingNav({ onOpenAuth }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const { installable, installed, install, platform } = usePWAInstall();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((scrollY / totalHeight) * 100);
      }

      // Track active section
      const sections = ["overview", "capabilities", "experience"];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Overview", href: "#overview", id: "overview" },
    { label: "Capabilities", href: "#capabilities", id: "capabilities" },
    { label: "Experience", href: "#experience", id: "experience" },
  ];

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (window.__lenis) {
      window.__lenis.scrollTo(href, { offset: -20 });
    } else {
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleInstall = () => {
    if (platform === "ios") {
      setShowIOSGuide(true);
    } else {
      install();
    }
  };

  // Only render install button when it makes sense
  const showInstall = installable && !installed;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white/85 backdrop-blur-xl border-b border-zinc-200/80 shadow-xs py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between">
          {/* Brand */}
          <a
            href="#overview"
            onClick={(e) => handleLinkClick(e, "#overview")}
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 rounded-lg p-1"
          >
            <img
              src={koggentLogo}
              alt="Koggent Logo"
              className="w-7 h-7 object-contain transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
            />
            <span className="text-[16px] font-bold tracking-tight text-zinc-900">
              Koggent
            </span>
          </a>

          {/* Desktop Nav with Active Indicator */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-1 p-1 rounded-full bg-zinc-100/90 border border-zinc-200/80 text-[13px] font-medium text-zinc-600 shadow-inner"
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`px-3.5 py-1 rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-900 ${
                    isActive
                      ? "bg-white text-zinc-950 font-semibold shadow-xs"
                      : "hover:text-zinc-950 hover:bg-zinc-200/40"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Install button — only when browser supports it */}
            {showInstall && (
              <button
                type="button"
                onClick={handleInstall}
                id="nav-install-btn"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 text-[12px] font-medium hover:bg-zinc-200 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 active:scale-95"
                aria-label="Install Koggent as an app"
              >
                <Download size={12} />
                <span>Install</span>
              </button>
            )}

            {installed && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[12px] font-medium select-none">
                <Check size={12} />
                Installed
              </span>
            )}

            <button
              type="button"
              onClick={onOpenAuth}
              className="px-4 py-2 text-[13px] font-semibold text-zinc-700 hover:text-zinc-950 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 rounded-full"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={onOpenAuth}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 text-white text-[13px] font-medium hover:bg-zinc-800 hover:shadow-md active:scale-[0.98] transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 group"
            >
              <span>Launch</span>
              <ArrowRight size={12} className="text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Cinematic Scroll Progress Bar */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-600 transition-all duration-75 ease-out opacity-90"
          style={{ width: `${scrollProgress}%` }}
        />
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="md:hidden fixed inset-0 z-50 bg-white flex flex-col justify-between px-6 py-6 animate-fadeIn"
        >
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
            <div className="flex items-center gap-2.5">
              <img src={koggentLogo} alt="Koggent Logo" className="w-7 h-7 object-contain" />
              <span className="text-lg font-bold text-zinc-900">Koggent</span>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-zinc-600 hover:text-zinc-950 rounded-lg"
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>

          <nav className="flex flex-col gap-5 py-8 text-xl font-medium text-zinc-800">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="py-1 hover:text-black transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-3 pt-6 border-t border-zinc-200">
            {showInstall && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleInstall();
                }}
                className="w-full py-3 rounded-full border border-zinc-300 text-zinc-900 font-semibold text-sm hover:bg-zinc-50 flex items-center justify-center gap-2"
              >
                <Download size={14} />
                Install Koggent
              </button>
            )}
            <button
              type="button"
              onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
              className="w-full py-3 rounded-full border border-zinc-300 text-zinc-900 font-semibold text-sm hover:bg-zinc-50"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
              className="w-full py-3 rounded-full bg-zinc-900 text-white font-medium text-sm flex items-center justify-center gap-2"
            >
              <span>Launch Koggent</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* iOS Install Guide Modal */}
      {showIOSGuide && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
          onClick={() => setShowIOSGuide(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-zinc-900">Install Koggent</h3>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="text-zinc-400 hover:text-zinc-900 p-1"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-zinc-600 leading-relaxed">
              To install Koggent on iOS:
            </p>
            <ol className="text-sm text-zinc-700 space-y-2 list-decimal list-inside">
              <li>Tap the <strong>Share</strong> button in Safari's toolbar</li>
              <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
              <li>Tap <strong>Add</strong> to confirm</li>
            </ol>
            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="w-full mt-2 py-2.5 rounded-full bg-zinc-900 text-white text-sm font-medium"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
