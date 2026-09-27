import { useState, useEffect, useRef } from "react";
import { ArrowRight, Download, Check, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePWAInstall } from "../../../hooks/usePWAInstall";

gsap.registerPlugin(ScrollTrigger);


export default function FinalCTA({ onOpenAuth }) {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const ctaRef = useRef(null);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  const { installable, installed, install, platform } = usePWAInstall();
  const showInstall = installable && !installed;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      gsap.set([headlineRef.current, ctaRef.current], { opacity: 1, y: 0 });
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

      gsap.from(ctaRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.15,
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleInstall = () => {
    if (platform === "ios") {
      setShowIOSGuide(true);
    } else {
      install();
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-28 sm:py-36 lg:py-44 bg-white overflow-hidden"
    >
      {/* Top rule */}
      <div aria-hidden="true" className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-16 sm:mb-20">
        <div className="h-px bg-zinc-100" />
      </div>

      {/* Atmospheric radial glow aura */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_75%_55%_at_50%_75%,rgba(99,102,241,0.08),rgba(6,182,212,0.04),transparent)] animate-pulseGlow pointer-events-none"
      />

      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 text-center relative z-10">
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-100/90 border border-zinc-200/80 text-[11px] font-mono uppercase tracking-[0.2em] font-semibold text-zinc-600 select-none shadow-2xs hover:border-zinc-300 transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span>Ready to begin</span>
          </div>
        </div>

        {/* Large Editorial Headline */}
        <h2
          ref={headlineRef}
          className="text-[clamp(2.5rem,6.5vw,6.5rem)] font-bold text-zinc-950 tracking-[-0.04em] leading-[0.94] mb-8 sm:mb-10"
        >
          Everything in one workspace.<br />
          <span className="text-zinc-400 font-light italic">Whatever you&apos;re building.</span>
        </h2>

        {/* Action Row */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={onOpenAuth}
            id="final-launch-btn"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-full bg-zinc-950 text-white font-medium text-sm hover:bg-zinc-800 hover:shadow-2xl hover:shadow-zinc-950/20 active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-md group"
          >
            <span>Launch Koggent Workspace</span>
            <ArrowRight size={14} className="text-zinc-400 group-hover:translate-x-1 transition-transform duration-200" />
          </button>

          {/* Genuine PWA Install Button */}
          {showInstall && (
            <button
              type="button"
              onClick={handleInstall}
              id="final-install-btn"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-white border border-zinc-200 text-zinc-800 font-medium text-sm hover:bg-zinc-50 hover:border-zinc-300 active:scale-[0.98] transition-all duration-150 cursor-pointer shadow-2xs"
              aria-label="Install Koggent as a web app"
            >
              <Download size={14} className="text-indigo-600" />
              <span>Install Koggent</span>
            </button>
          )}

          {installed && (
            <span className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium text-sm select-none">
              <Check size={14} />
              Installed
            </span>
          )}
        </div>

        {/* iOS Install Instructions Modal / Card */}
        {showIOSGuide && (
          <div className="mt-8 mx-auto max-w-sm p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-left text-xs sm:text-sm text-zinc-700 space-y-2 animate-fadeIn shadow-lg">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-zinc-900">Install on iOS</p>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="p-1 text-zinc-400 hover:text-zinc-700 cursor-pointer"
                aria-label="Close"
              >
                <X size={15} />
              </button>
            </div>
            <p className="text-zinc-600 text-xs">
              Tap the <strong>Share</strong> button in Safari toolbar, then choose <strong>Add to Home Screen</strong>.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
