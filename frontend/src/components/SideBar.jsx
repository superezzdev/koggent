import {
  PanelLeftIcon,
  PenSquare,
  Plus,
  MessageSquare,
  User,
  Coins,
  LogOut,
  PanelRight,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { getConversations } from "../features/getConversations";
import { useDispatch, useSelector } from "react-redux";
import {
  setConversations,
  addConversation,
  setSelectedConversation,
} from "../redux/conversationSlice";
import { createConversation } from "../features/createConversation";
import logOut from "../features/logOut";
import { setUserdata } from "../redux/userSlice";
import { setMessages, setArtifacts } from "../redux/messageSlice";
import BillingDrawer from "./BillingDrawer";

function SideBar() {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const [imageError, setImageError] = useState(false);

  const { conversations, selectedConversation } = useSelector(
    (state) => state.conversation
  );
  const { userData } = useSelector((state) => state.user);
  const [showBilling, setShowBilling] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const userIdentifier = userData?._id || userData?.userId;

  useEffect(() => {
    if (!userIdentifier) return;
    const getConv = async () => {
      const data = await getConversations();
      if (data) {
        dispatch(setConversations(data));
      }
    };

    getConv();
  }, [userIdentifier, dispatch]);

  const handleLogout = async () => {
    await logOut();
    dispatch(setUserdata(null));
    dispatch(setSelectedConversation(null));
    dispatch(setConversations([]));
    dispatch(setMessages([]));
    dispatch(setArtifacts([]));
  };

  const handleCreateConversation = async () => {
    const data = await createConversation();
    if (data) {
      dispatch(addConversation(data));
      dispatch(setSelectedConversation(data));
      dispatch(setMessages([]));
    }
  };



  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        className="lg:hidden fixed top-3.5 left-4 z-40 flex items-center justify-center w-8 h-8 rounded-lg bg-[#0d0f14] border border-white/[0.08] text-slate-400 hover:text-slate-200 transition-colors duration-150 cursor-pointer shadow-sm"
        onClick={() => setMobileOpen(true)}
        title="Open navigation"
        aria-label="Open navigation"
      >
        <Menu size={16} />
      </button>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Mobile Drawer (Always rendered, slides in/out) */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-[280px] max-w-[85vw] h-screen bg-[#0d0f14] border-r border-white/[0.06] flex flex-col transition-transform duration-200 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full pointer-events-none"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center gap-2.5 px-4 py-4 border-b border-white/[0.06] shrink-0">
            <span className="text-[16px] font-semibold text-slate-100 tracking-tight flex-1">
              Koggent
            </span>

            <span className="text-[10px] font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full tracking-wide">
              {userData?.plan || "free"}
            </span>

            <button
              className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer"
              onClick={async () => {
                await handleCreateConversation();
                setMobileOpen(false);
              }}
              title="New Chat"
            >
              <PenSquare size={14} />
            </button>

            <button
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer"
              title="Close navigation"
            >
              <X size={16} />
            </button>
          </div>

          {/* New Chat Button */}
          <div className="px-4 pt-4 pb-1 shrink-0">
            <button
              className="w-full flex items-center justify-center gap-2 text-sm font-medium text-white bg-linear-to-br from-indigo-500 to-violet-700 rounded-xl py-[10px] border-none cursor-pointer hover:opacity-90 transition-opacity duration-150"
              onClick={async () => {
                await handleCreateConversation();
                setMobileOpen(false);
              }}
            >
              <Plus size={15} />
              New Chat
            </button>
          </div>

          {/* Recents Header */}
          <div className="px-5 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-slate-600 shrink-0">
            {conversations.length === 0 ? "No Recent Conversations" : "Recents"}
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {conversations.map((conv, i) => {
              const isActive = selectedConversation?._id === conv?._id;

              return (
                <div
                  key={conv?._id || i}
                  onClick={() => {
                    dispatch(setSelectedConversation(conv));
                    setMobileOpen(false);
                  }}
                  className={`flex items-center gap-2.5 cursor-pointer mb-0.5 px-3 py-2.5 rounded-[10px] border transition-colors duration-150 ${
                    isActive
                      ? "bg-indigo-500/10 border-indigo-500/[0.18]"
                      : "bg-transparent border-transparent hover:bg-white/[0.02]"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center shrink-0 w-[28px] h-[28px] rounded-lg transition-colors duration-150 ${
                      isActive
                        ? "bg-indigo-500/15 text-indigo-400"
                        : "bg-white/[0.05] text-slate-500"
                    }`}
                  >
                    <MessageSquare size={13} />
                  </div>

                  <span
                    className={`text-[13px] font-medium truncate ${
                      isActive ? "text-slate-100" : "text-slate-300"
                    }`}
                  >
                    {conv?.title || "New Chat"}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mx-2.5 h-px bg-white/[0.06] shrink-0" />

          {/* User Section */}
          <div className="px-3.5 py-3.5 shrink-0">
            {userData ? (
              <div className="flex items-center gap-2.5 cursor-pointer rounded-xl px-3 py-2.5 hover:bg-white/[0.05] transition-colors duration-150">
                <div className="relative shrink-0">
                  {userData?.avatar && !imageError ? (
                    <img
                      className="w-9 h-9 rounded-[10px] object-cover border-2 border-indigo-500/25"
                      src={userData?.avatar}
                      alt={"image"}
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-[10px] bg-white/[0.06] flex items-center justify-center">
                      <User size={15} className="text-slate-400" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-semibold text-slate-100 truncate">
                    {userData?.name || "user"}
                  </p>

                  <p className="text-[11px] text-slate-400 mt-px">
                    {(userData?.plan
                      ? userData.plan.charAt(0).toUpperCase() +
                        userData.plan.slice(1)
                      : "Free") + " Plan"}
                  </p>
                </div>

                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => {
                      setShowBilling(true);
                      setMobileOpen(false);
                    }}
                    title="Billing & Plans"
                    className="flex items-center justify-center w-7 h-7 rounded-[7px] border-none bg-transparent text-yellow-500 cursor-pointer hover:bg-white/[0.08] hover:text-yellow-400 transition-all duration-150"
                  >
                    <Coins size={16} />
                  </button>

                  <button
                    className="flex items-center justify-center w-7 h-7 rounded-[7px] border-none bg-transparent text-slate-600 cursor-pointer hover:bg-white/[0.08] hover:text-slate-400 transition-all duration-150"
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    title="Log out"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="w-full flex items-center justify-center gap-2 text-sm font-medium text-slate-200 bg-white/[0.05] border border-white/[0.08] rounded-xl py-[11px] cursor-pointer hover:bg-white/[0.08] transition-colors duration-150"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Desktop Sidebar: Collapsed */}
      {collapsed ? (
        <aside className="hidden lg:flex flex-col items-center w-[56px] h-screen bg-[#0d0f14] border-r border-white/[0.06] py-4 gap-1 shrink-0">
          <button
            className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer mb-1"
            onClick={() => setCollapsed(false)}
            title="Expand sidebar"
          >
            <PanelRight size={18} />
          </button>

          <button
            className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer"
            onClick={handleCreateConversation}
            title="New Chat"
          >
            <Plus size={17} />
          </button>

          <div className="flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pt-5">
            {conversations.map((conv, i) => {
              const isActive = selectedConversation?._id === conv?._id;

              return (
                <div
                  key={conv?._id || i}
                  onClick={() => dispatch(setSelectedConversation(conv))}
                  title={conv?.title || "New Chat"}
                  className={`flex items-center justify-center cursor-pointer mb-1.5 w-9 h-9 rounded-[10px] border transition-colors duration-150 ${
                    isActive
                      ? "bg-indigo-500/10 border-indigo-500/[0.18]"
                      : "bg-transparent border-transparent hover:bg-white/[0.04]"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center shrink-0 w-[28px] h-[28px] rounded-lg transition-colors duration-150 ${
                      isActive
                        ? "bg-indigo-500/15 text-indigo-400"
                        : "bg-white/[0.05] text-slate-500"
                    }`}
                  >
                    <MessageSquare size={13} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="relative shrink-0 mt-auto">
            {userData?.avatar && !imageError ? (
              <img
                className="w-9 h-9 rounded-[10px] object-cover border-2 border-indigo-500/25 cursor-pointer"
                src={userData?.avatar}
                alt={"image"}
                title={userData?.name}
                onClick={() => setShowBilling(true)}
                onError={() => setImageError(true)}
              />
            ) : (
              <div
                className="w-9 h-9 rounded-[10px] bg-white/[0.06] flex items-center justify-center cursor-pointer"
                onClick={() => setShowBilling(true)}
                title={userData?.name || "User"}
              >
                <User size={15} className="text-slate-400" />
              </div>
            )}
          </div>
        </aside>
      ) : (
        /* Desktop Sidebar: Expanded */
        <aside className="hidden lg:flex w-[270px] h-screen shrink-0 bg-[#0d0f14] border-r border-white/[0.06] flex-col">
          <div className="flex items-center gap-2.5 px-4 py-4 border-b border-white/[0.06]">
            <button
              className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer"
              onClick={() => setCollapsed(true)}
              title="Collapse sidebar"
            >
              <PanelLeftIcon size={16} />
            </button>

            <span className="text-[16px] font-semibold text-slate-100 tracking-tight flex-1">
              Koggent
            </span>

            <span className="text-[10px] font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full tracking-wide">
              {userData?.plan || "free"}
            </span>

            <button
              className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer"
              onClick={handleCreateConversation}
              title="New Chat"
            >
              <PenSquare size={14} />
            </button>
          </div>

          <div className="px-4 pt-4 pb-1">
            <button
              className="w-full flex items-center justify-center gap-2 text-sm font-medium text-white bg-linear-to-br from-indigo-500 to-violet-700 rounded-xl py-[10px] border-none cursor-pointer hover:opacity-90 transition-opacity duration-150"
              onClick={handleCreateConversation}
            >
              <Plus size={15} />
              New Chat
            </button>
          </div>

          <div className="px-5 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-slate-600">
            {conversations.length === 0 ? "No Recent Conversations" : "Recents"}
          </div>

          <div className="flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {conversations.map((conv, i) => {
              const isActive = selectedConversation?._id === conv?._id;

              return (
                <div
                  key={conv?._id || i}
                  onClick={() => dispatch(setSelectedConversation(conv))}
                  className={`flex items-center gap-2.5 cursor-pointer mb-0.5 px-3 py-2.5 rounded-[10px] border transition-colors duration-150 ${
                    isActive
                      ? "bg-indigo-500/10 border-indigo-500/[0.18]"
                      : "bg-transparent border-transparent hover:bg-white/[0.02]"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center shrink-0 w-[28px] h-[28px] rounded-lg transition-colors duration-150 ${
                      isActive
                        ? "bg-indigo-500/15 text-indigo-400"
                        : "bg-white/[0.05] text-slate-500"
                    }`}
                  >
                    <MessageSquare size={13} />
                  </div>

                  <span
                    className={`text-[13px] font-medium truncate ${
                      isActive ? "text-slate-100" : "text-slate-300"
                    }`}
                  >
                    {conv?.title || "New Chat"}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mx-2.5 h-px bg-white/[0.06]" />

          <div className="px-3.5 py-3.5">
            {userData ? (
              <div className="flex items-center gap-2.5 cursor-pointer rounded-xl px-3 py-2.5 hover:bg-white/[0.05] transition-colors duration-150">
                <div className="relative shrink-0">
                  {userData?.avatar && !imageError ? (
                    <img
                      className="w-9 h-9 rounded-[10px] object-cover border-2 border-indigo-500/25"
                      src={userData?.avatar}
                      alt={"image"}
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-[10px] bg-white/[0.06] flex items-center justify-center">
                      <User size={15} className="text-slate-400" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-semibold text-slate-100 truncate">
                    {userData?.name || "user"}
                  </p>

                  <p className="text-[11px] text-slate-400 mt-px">
                    {(userData?.plan
                      ? userData.plan.charAt(0).toUpperCase() +
                        userData.plan.slice(1)
                      : "Free") + " Plan"}
                  </p>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => setShowBilling(true)}
                    title="Billing & Plans"
                    className="flex items-center justify-center w-7 h-7 rounded-[7px] border-none bg-transparent text-yellow-500 cursor-pointer hover:bg-white/[0.08] hover:text-yellow-400 transition-all duration-150"
                  >
                    <Coins size={16} />
                  </button>

                  <button
                    className="flex items-center justify-center w-7 h-7 rounded-[7px] border-none bg-transparent text-slate-600 cursor-pointer hover:bg-white/[0.08] hover:text-slate-400 transition-all duration-150"
                    onClick={handleLogout}
                    title="Log out"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="w-full flex items-center justify-center gap-2 text-sm font-medium text-slate-200 bg-white/[0.05] border border-white/[0.08] rounded-xl py-[11px] cursor-pointer hover:bg-white/[0.08] transition-colors duration-150"
              >
                Login
              </button>
            )}
          </div>
        </aside>
      )}

      {/* Billing Drawer */}
      <BillingDrawer
        open={showBilling}
        onClose={() => setShowBilling(false)}
      />
    </>
  );
}

export default SideBar;
