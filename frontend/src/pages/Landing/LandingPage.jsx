import { useState, useEffect } from "react";
import LandingNav from "./components/LandingNav";
import HeroSection from "./sections/HeroSection";
import StorySection from "./sections/StorySection";
import CapabilityStory from "./sections/CapabilityStory";
import ExperienceSection from "./sections/ExperienceSection";
import FinalCTA from "./sections/FinalCTA";
import LandingFooter from "./components/LandingFooter";
import LegalModal from "./components/LegalModal";
import { useLenis } from "./animations/useLenis";

/**
 * Koggent Landing Page — Cinematic Redesign
 *
 * Chapters:
 *  01 — Hero         (HeroSection)
 *  02 — The Idea     (StorySection)
 *  03 — Capabilities (CapabilityStory — GSAP pinned scroll)
 *  04 — Experience   (ExperienceSection — dark cinematic)
 *  05 — Final CTA    (FinalCTA)
 */
export default function LandingPage({ onOpenAuth }) {
  const [legalTopic, setLegalTopic] = useState(null);

  // Centralised Lenis smooth scroll — integrated with GSAP ScrollTrigger
  useLenis();

  // Prevent body scroll when legal modal is open
  useEffect(() => {
    if (legalTopic) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [legalTopic]);

  return (
    <div className="min-h-screen w-full bg-white text-zinc-900 font-sans antialiased selection:bg-indigo-500/20 selection:text-indigo-900 overflow-x-hidden">

      {/* Navigation */}
      <LandingNav onOpenAuth={onOpenAuth} />

      <main>
        {/* Ch 01 — Hero */}
        <HeroSection onOpenAuth={onOpenAuth} />

        {/* Ch 02 — The Idea */}
        <StorySection />

        {/* Ch 03 — Capabilities (cinematic pinned scroll) */}
        <CapabilityStory />

        {/* Ch 04 — Experience (dark cinematic showcase) */}
        <ExperienceSection onOpenAuth={onOpenAuth} />

        {/* Ch 05 — Final CTA */}
        <FinalCTA onOpenAuth={onOpenAuth} />
      </main>

      {/* Compact footer */}
      <LandingFooter
        onOpenLegal={(topic) => setLegalTopic(topic)}
        onOpenAuth={onOpenAuth}
      />

      {/* Legal modal */}
      {legalTopic && (
        <LegalModal
          topic={legalTopic}
          onClose={() => setLegalTopic(null)}
        />
      )}
    </div>
  );
}
