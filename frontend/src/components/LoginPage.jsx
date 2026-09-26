import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserdata } from "../redux/userSlice";
import api from "../../utils/axios";
import { auth, googleProvider } from "../../utils/firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import {
  Loader2,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  X,
  Shield,
  FileText,
  Lock,
  Info,
} from "lucide-react";
import koggentLogo from "../assets/koggent-logo.png";

export default function LoginPage() {
  const dispatch = useDispatch();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState("email"); // "email" | "password"
  const [authMode, setAuthMode] = useState("signin"); // "signin" | "signup"
  const [showPassword, setShowPassword] = useState(false);

  // Status states
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  // Modal state for legal/info views
  const [modalTopic, setModalTopic] = useState(null);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setModalTopic(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Exchange Firebase ID Token with Koggent backend session
  const establishSession = async (token) => {
    try {
      const { data } = await api.post("/api/auth/login", { token });
      dispatch(setUserdata(data));
    } catch (err) {
      console.error("Session establishment failed:", err);
      const msg =
        err.response?.data?.message ||
        "Could not connect to server session. Please try again.";
      setError(msg);
      throw err;
    }
  };

  // Google OAuth
  const handleGoogleLogin = async () => {
    if (isGoogleLoading || isSubmitting) return;
    setError("");
    setInfoMessage("");
    setIsGoogleLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      await establishSession(token);
    } catch (err) {
      if (
        err.code === "auth/popup-closed-by-user" ||
        err.code === "auth/cancelled-popup-request"
      ) {
        // User intentionally closed popup
      } else if (err.code === "auth/network-request-failed") {
        setError("Network connection error. Please check your connectivity.");
      } else {
        setError(
          err.message?.replace("Firebase: ", "") ||
            "Failed to sign in with Google. Please try again."
        );
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Step 1: Validate email and move to password step
  const handleEmailContinue = (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmed = email.trim();
    if (!trimmed) {
      setError("Please enter your email or username.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setInfoMessage("");
    setStep("password");
  };

  // Step 2: Password sign-in or sign-up
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    if (authMode === "signup" && password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }

    setError("");
    setInfoMessage("");
    setIsSubmitting(true);

    try {
      let userCredential;
      if (authMode === "signin") {
        userCredential = await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
      } else {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
      }

      const token = await userCredential.user.getIdToken();
      await establishSession(token);
    } catch (err) {
      console.error("Auth error:", err.code, err.message);
      switch (err.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
          setError("Incorrect password or email. Please verify your credentials.");
          break;
        case "auth/user-not-found":
          setError("No account found with this email. You can create one below.");
          setAuthMode("signup");
          break;
        case "auth/email-already-in-use":
          setError("An account already exists with this email. Please sign in instead.");
          setAuthMode("signin");
          break;
        case "auth/weak-password":
          setError("Password is too weak. Please use at least 6 characters.");
          break;
        case "auth/too-many-requests":
          setError("Too many unsuccessful attempts. Please try again shortly.");
          break;
        case "auth/network-request-failed":
          setError("Network connection issue. Please check your internet connection.");
          break;
        default:
          setError(
            err.message?.replace("Firebase: ", "") ||
              "Authentication failed. Please try again."
          );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Password reset request
  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError("Please enter your email to receive a password reset link.");
      setStep("email");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setInfoMessage(`Password reset link sent to ${email.trim()}. Check your inbox.`);
    } catch (err) {
      setError(
        err.code === "auth/user-not-found"
          ? "No account found with this email."
          : "Could not send reset email. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050507] text-white flex flex-col justify-between selection:bg-cyan-500/20 selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Main Split Layout */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between px-6 sm:px-12 lg:px-16 py-12 lg:py-0">
        
        {/* Left Side: Focused Authentication Area (Frameless, clean hierarchy) */}
        <section
          aria-label="Authentication"
          className="w-full lg:w-1/2 flex flex-col justify-center max-w-[390px] mx-auto lg:mx-0 my-auto py-6"
        >
          {/* Koggent Brand Header */}
          <div className="flex items-center gap-3 mb-8 sm:mb-10">
            <img
              src={koggentLogo}
              alt="Koggent Logo"
              className="w-10 h-10 object-contain select-none"
            />
            <span className="text-xl font-bold tracking-tight text-white">
              Koggent
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-[44px] font-extrabold text-white tracking-tight leading-[1.1] mb-2.5">
            Welcome to Koggent
          </h1>
          <p className="text-[14px] text-zinc-400 mb-8 font-normal leading-normal">
            Sign in to access your multi-agent AI workspace.
          </p>

          {/* Feedback Messages */}
          {error && (
            <div
              role="alert"
              className="mb-5 p-3.5 rounded-xl bg-red-500/[0.08] border border-red-500/20 text-xs text-red-300 flex items-start gap-2.5 transition-all"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span className="flex-1 leading-relaxed">{error}</span>
              <button
                type="button"
                onClick={() => setError("")}
                className="text-red-400/80 hover:text-red-200 transition-colors p-0.5 cursor-pointer"
                aria-label="Dismiss error"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {infoMessage && (
            <div
              role="status"
              className="mb-5 p-3.5 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2.5 transition-all"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="flex-1 leading-relaxed">{infoMessage}</span>
              <button
                type="button"
                onClick={() => setInfoMessage("")}
                className="text-emerald-400/80 hover:text-emerald-200 transition-colors p-0.5 cursor-pointer"
                aria-label="Dismiss notice"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Provider Buttons */}
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading || isSubmitting}
              className="w-full h-11 sm:h-12 rounded-full bg-white text-black font-semibold text-sm flex items-center justify-center gap-3 hover:bg-neutral-200 active:scale-[0.99] transition-all duration-150 cursor-pointer shadow-sm disabled:opacity-60 disabled:cursor-not-allowed select-none"
            >
              {isGoogleLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Connecting with Google...</span>
                </>
              ) : (
                <>
                  <FcGoogle className="w-5 h-5 shrink-0" />
                  <span>Continue with Google</span>
                </>
              )}
            </button>
          </div>

          {/* Minimal Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="w-full border-t border-white/[0.1]" />
            <span className="absolute bg-[#050507] px-3 text-xs text-zinc-500 uppercase tracking-widest font-medium">
              or
            </span>
          </div>

          {/* Email / Username Step */}
          {step === "email" ? (
            <form onSubmit={handleEmailContinue} className="flex flex-col gap-3">
              <div>
                <label htmlFor="auth-email-input" className="sr-only">
                  Email or username
                </label>
                <input
                  id="auth-email-input"
                  name="email"
                  type="text"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Email or username"
                  autoComplete="username email"
                  autoCapitalize="none"
                  spellCheck="false"
                  disabled={isSubmitting || isGoogleLoading}
                  className="w-full h-11 sm:h-12 px-4 rounded-xl bg-white/[0.04] border border-white/[0.12] hover:border-white/[0.2] text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50 transition-all disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={!email.trim() || isSubmitting || isGoogleLoading}
                className={`w-full h-11 sm:h-12 rounded-full text-sm font-semibold transition-all duration-150 flex items-center justify-center gap-2 select-none ${
                  email.trim() && !isSubmitting && !isGoogleLoading
                    ? "bg-white text-black hover:bg-neutral-200 active:scale-[0.99] cursor-pointer shadow-sm"
                    : "bg-neutral-900 text-zinc-500 border border-white/[0.06] cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                ) : (
                  "Continue"
                )}
              </button>
            </form>
          ) : (
            /* Password Step */
            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-3">
              {/* Active email chip with Change option */}
              <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs">
                <span className="text-zinc-300 truncate max-w-[240px]">
                  {email}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setPassword("");
                    setError("");
                  }}
                  className="text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer transition-colors"
                >
                  Change
                </button>
              </div>

              {/* Password Input */}
              <div className="relative">
                <label htmlFor="auth-password-input" className="sr-only">
                  Password
                </label>
                <input
                  id="auth-password-input"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder={
                    authMode === "signin"
                      ? "Enter your password"
                      : "Create a password (min. 6 chars)"
                  }
                  autoFocus
                  autoComplete={
                    authMode === "signin"
                      ? "current-password"
                      : "new-password"
                  }
                  disabled={isSubmitting}
                  className="w-full h-11 sm:h-12 pl-4 pr-11 rounded-xl bg-white/[0.04] border border-white/[0.12] hover:border-white/[0.2] text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50 transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors p-1 cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Action helpers */}
              <div className="flex items-center justify-between text-xs px-1 pt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode(authMode === "signin" ? "signup" : "signin");
                    setError("");
                  }}
                  className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  {authMode === "signin"
                    ? "New to Koggent? Create account"
                    : "Already have an account? Sign in"}
                </button>

                {authMode === "signin" && (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!password || isSubmitting}
                className={`w-full h-11 sm:h-12 rounded-full text-sm font-semibold transition-all duration-150 flex items-center justify-center gap-2 select-none ${
                  password && !isSubmitting
                    ? "bg-white text-black hover:bg-neutral-200 active:scale-[0.99] cursor-pointer shadow-sm"
                    : "bg-neutral-900 text-zinc-500 border border-white/[0.06] cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                ) : authMode === "signin" ? (
                  "Sign in"
                ) : (
                  "Create account"
                )}
              </button>
            </form>
          )}

          {/* Legal / Policy Disclaimer */}
          <p className="text-[11px] text-zinc-500 mt-6 leading-relaxed">
            By continuing, you agree to our{" "}
            <button
              type="button"
              onClick={() => setModalTopic("terms")}
              className="text-zinc-400 hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
            >
              Terms of Service
            </button>{" "}
            and{" "}
            <button
              type="button"
              onClick={() => setModalTopic("privacy")}
              className="text-zinc-400 hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            , and to our{" "}
            <button
              type="button"
              onClick={() => setModalTopic("cookies")}
              className="text-zinc-400 hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
            >
              Cookie Use
            </button>
            .
          </p>
        </section>

        {/* Right Side: Proportional & Subtle Koggent Brand Mark */}
        <section
          aria-hidden="true"
          className="hidden lg:flex lg:w-1/2 items-center justify-center relative pl-10 select-none"
        >
          {/* Very Subtle Ambient Atmosphere */}
          <div className="absolute w-[460px] h-[460px] rounded-full bg-gradient-to-tr from-cyan-500/10 via-purple-600/5 to-transparent blur-3xl pointer-events-none -z-10" />

          {/* Primary Koggent Logo Mark - Perfectly Proportioned & Subtle/Translucent */}
          <div className="w-full max-w-[460px] xl:max-w-[500px] aspect-square flex items-center justify-center relative p-6">
            <img
              src={koggentLogo}
              alt="Koggent Brand Mark"
              className="w-full h-full object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.85)] opacity-35 hover:opacity-50 transition-opacity duration-700"
            />
          </div>
        </section>
      </main>

      {/* Footer Navigation */}
      <footer className="w-full py-5 px-6 border-t border-white/[0.04] shrink-0 bg-[#050507]">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-zinc-500">
          <button
            type="button"
            onClick={() => setModalTopic("about")}
            className="hover:text-zinc-300 transition-colors cursor-pointer"
          >
            About
          </button>
          <button
            type="button"
            onClick={() => setModalTopic("terms")}
            className="hover:text-zinc-300 transition-colors cursor-pointer"
          >
            Terms of Service
          </button>
          <button
            type="button"
            onClick={() => setModalTopic("privacy")}
            className="hover:text-zinc-300 transition-colors cursor-pointer"
          >
            Privacy Policy
          </button>
          <button
            type="button"
            onClick={() => setModalTopic("cookies")}
            className="hover:text-zinc-300 transition-colors cursor-pointer"
          >
            Cookie Use
          </button>
          <button
            type="button"
            onClick={() => setModalTopic("security")}
            className="hover:text-zinc-300 transition-colors cursor-pointer"
          >
            Security
          </button>
          <span className="text-zinc-600">·</span>
          <span className="text-zinc-500">© 2026 Koggent Inc.</span>
        </div>
      </footer>

      {/* Legal & Info Modal */}
      {modalTopic && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn"
          onClick={() => setModalTopic(null)}
        >
          <div
            className="w-full max-w-lg bg-[#0e1017] border border-white/[0.1] rounded-2xl p-6 sm:p-7 shadow-2xl relative flex flex-col gap-4 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                {modalTopic === "terms" && <FileText className="w-5 h-5 text-cyan-400" />}
                {modalTopic === "privacy" && <Shield className="w-5 h-5 text-indigo-400" />}
                {modalTopic === "cookies" && <Lock className="w-5 h-5 text-purple-400" />}
                {modalTopic === "about" && <Info className="w-5 h-5 text-cyan-400" />}
                {modalTopic === "security" && <Shield className="w-5 h-5 text-emerald-400" />}
                <h3 className="text-base font-semibold text-white capitalize">
                  {modalTopic === "terms" && "Terms of Service"}
                  {modalTopic === "privacy" && "Privacy Policy"}
                  {modalTopic === "cookies" && "Cookie Usage"}
                  {modalTopic === "about" && "About Koggent"}
                  {modalTopic === "security" && "Security & Compliance"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalTopic(null)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="text-xs text-zinc-300 leading-relaxed max-h-[60vh] overflow-y-auto space-y-3 pr-1">
              {modalTopic === "about" && (
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

              {modalTopic === "terms" && (
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

              {modalTopic === "privacy" && (
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

              {modalTopic === "cookies" && (
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

              {modalTopic === "security" && (
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
                onClick={() => setModalTopic(null)}
                className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-xs font-medium text-white transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
