import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Crown, X, Loader2, Check } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../features/createOrder";
import { verifyPayment } from "../features/verifyPayment";
import getCurrentUser from "../features/getCurrentUser";
import { setUserdata } from "../redux/userSlice";
import { loadRazorpay } from "../features/loadRazorpay";

function BillingDrawer({ open, onClose }) {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loadingPlan, setLoadingPlan] = useState(null);

  useEffect(() => {
    if (open) {
      loadRazorpay();
    }
  }, [open]);

  const handleUpgrade = async (plan) => {
    try {
      if (loadingPlan) return;

      setLoadingPlan(plan);

      if (!window.Razorpay) {
        const loaded = await loadRazorpay();
        if (!loaded || !window.Razorpay) {
          alert("Razorpay checkout is loading or blocked. Please refresh the page.");
          setLoadingPlan(null);
          return;
        }
      }
      const data = await createOrder(plan);

      if (!data?.order?.id) {
        console.error("Failed to create order:", data);
        setLoadingPlan(null);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data?.order?.amount,
        currency: data?.order?.currency,
        name: "Koggent",
        description: `${data?.plan?.name || plan} Plan`,
        order_id: data?.order?.id,
        prefill: {
          name: userData?.name || "",
          email: userData?.email || "",
        },
        theme: {
          color: "#4f46e5",
        },
        handler: async (response) => {
          try {
            await verifyPayment(response);
            const updatedUser = await getCurrentUser();
            if (updatedUser) {
              dispatch(setUserdata(updatedUser));
            }
            onClose();
          } catch (error) {
            console.error("Payment verification failed:", error);
          } finally {
            setLoadingPlan(null);
          }
        },
        modal: {
          ondismiss: () => {
            setLoadingPlan(null);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", (response) => {
        console.error("Payment failed:", response.error);
        setLoadingPlan(null);
      });

      razorpay.open();
    } catch (error) {
      console.error("handleUpgrade error:", error);
      setLoadingPlan(null);
    }
  };

  const isStarter = userData?.plan === "starter";
  const isPro = userData?.plan === "pro";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25 }}
            className="fixed right-0 top-0 z-50 h-screen w-full max-w-[380px] bg-[#0f1117] border-l border-white/10 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div>
                <div className="text-white text-lg font-semibold">Billing</div>
                <div className="text-slate-400 text-sm">Plans & Credits</div>
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center cursor-pointer"
              >
                <X size={18} className="text-slate-300" />
              </button>
            </div>

            <div className="p-5">
              <div className="rounded-xl bg-white/[0.04] border border-white/10 p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-slate-400 text-sm">Current Plan</p>
                    <h3 className="text-white text-xl font-bold capitalize">
                      {userData?.plan || "free"}
                    </h3>
                  </div>

                  <Crown className="text-yellow-400" />
                </div>
              </div>
            </div>

            <div className="px-5 flex-1 overflow-auto space-y-4">
              <div className="mt-5">
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                  <span>Credits</span>
                  <span>
                    {userData?.credits || 0}/{userData?.totalCredits || 100}
                  </span>
                </div>

                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        ((userData?.credits || 0) /
                          (userData?.totalCredits || 1)) *
                          100,
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div
                className={`rounded-xl border p-4 transition-all ${
                  isStarter
                    ? "border-indigo-500/50 bg-indigo-500/[0.06]"
                    : "border-white/10"
                }`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-white font-semibold">Starter Plan</h3>
                  {isStarter && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-medium flex items-center gap-1">
                      <Check size={12} /> Active
                    </span>
                  )}
                </div>

                <p className="text-indigo-400 text-2xl font-bold mt-2">₹199</p>

                <p className="text-slate-400 text-sm mt-1">500 Credits / month</p>

                <button
                  disabled={isStarter || loadingPlan !== null}
                  className={`mt-4 w-full rounded-lg py-2 text-white font-medium flex items-center justify-center gap-2 transition-all ${
                    isStarter
                      ? "bg-white/10 text-slate-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                  }`}
                  onClick={() => handleUpgrade("starter")}
                >
                  {loadingPlan === "starter" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Processing...
                    </>
                  ) : isStarter ? (
                    "Current Plan"
                  ) : (
                    "Upgrade to Starter"
                  )}
                </button>
              </div>

              <div
                className={`rounded-xl border p-4 transition-all ${
                  isPro
                    ? "border-indigo-500/50 bg-indigo-500/[0.06]"
                    : "border-white/10"
                }`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-white font-semibold">Pro Plan</h3>
                  {isPro && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-medium flex items-center gap-1">
                      <Check size={12} /> Active
                    </span>
                  )}
                </div>

                <p className="text-indigo-400 text-2xl font-bold mt-2">₹499</p>

                <p className="text-slate-400 text-sm mt-1">1000 Credits / month</p>

                <button
                  disabled={isPro || loadingPlan !== null}
                  className={`mt-4 w-full rounded-lg py-2 text-white font-medium flex items-center justify-center gap-2 transition-all ${
                    isPro
                      ? "bg-white/10 text-slate-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                  }`}
                  onClick={() => handleUpgrade("pro")}
                >
                  {loadingPlan === "pro" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Processing...
                    </>
                  ) : isPro ? (
                    "Current Plan"
                  ) : (
                    "Upgrade to Pro"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default BillingDrawer;
