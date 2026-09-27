import { useEffect } from "react";
import { X, FileText, Shield, Lock, Info } from "lucide-react";

export default function LegalModal({ topic, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!topic) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#0e1017] border border-white/[0.1] rounded-2xl p-6 sm:p-7 shadow-2xl relative flex flex-col gap-4 text-left select-text"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            {topic === "terms" && <FileText className="w-5 h-5 text-cyan-400" />}
            {topic === "privacy" && <Shield className="w-5 h-5 text-indigo-400" />}
            {topic === "cookies" && <Lock className="w-5 h-5 text-purple-400" />}
            {topic === "about" && <Info className="w-5 h-5 text-cyan-400" />}
            {topic === "security" && <Shield className="w-5 h-5 text-emerald-400" />}
            <h3 className="text-base font-semibold text-white capitalize">
              {topic === "terms" && "Terms of Service"}
              {topic === "privacy" && "Privacy Policy"}
              {topic === "cookies" && "Cookie Usage"}
              {topic === "about" && "About Koggent"}
              {topic === "security" && "Security & Compliance"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div className="text-xs text-zinc-300 leading-relaxed max-h-[60vh] overflow-y-auto space-y-3 pr-1">
          {topic === "about" && (
            <>
              <p>
                Koggent is a unified multi-agent AI platform built for modern developers,
                researchers, and teams. Koggent coordinates specialized AI agents across
                Chat, Code execution, Vision analysis, Document intelligence (PDF/PPT), and
                autonomous Web Search.
              </p>
              <p>
                Designed with high execution speed, strict security boundaries, and modular
                agent architectures, Koggent brings deep reasoning and actionable tool
                execution into a single refined workspace.
              </p>
            </>
          )}

          {topic === "terms" && (
            <>
              <p>
                By accessing or using the Koggent workspace, API, or agent tools, you agree
                to comply with these Terms of Service.
              </p>
              <p>
                You retain full ownership of all data, prompts, and outputs created within
                your private workspace. Koggent does not train proprietary public models on
                your private inputs or customer communications.
              </p>
              <p>
                Usage of automated agents must respect our Acceptable Use Guidelines,
                prohibiting harmful activities, unauthorized network access, and abusive
                traffic generation.
              </p>
            </>
          )}

          {topic === "privacy" && (
            <>
              <p>
                Your privacy and data sovereignty are paramount. Koggent encrypts all
                workspace data in transit (TLS 1.3) and at rest (AES-256).
              </p>
              <p>
                Authentication credentials and identity tokens are verified securely through
                Firebase and session cookies managed with strict SameSite and HTTP-only
                guarantees. We never sell personal information or share workspace data with
                third parties without authorization.
              </p>
            </>
          )}

          {topic === "cookies" && (
            <>
              <p>
                Koggent uses strictly necessary cookies and session tokens to authenticate
                users, maintain active login state, prevent cross-site request forgery, and
                secure user preferences.
              </p>
              <p>
                We do not deploy intrusive third-party cross-site advertising trackers.
              </p>
            </>
          )}

          {topic === "security" && (
            <>
              <p>
                Security is embedded in every layer of the Koggent platform:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
                <li>Strict JWT verification with Firebase Admin on microservice gateways</li>
                <li>Ephemeral sandboxed agent execution environments</li>
                <li>Zero storage of sensitive user credentials or plaintext tokens</li>
                <li>Continuous session verification and active revocation on logout</li>
              </ul>
            </>
          )}
        </div>

        <div className="pt-3 border-t border-white/[0.08] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-xs font-medium text-white transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
