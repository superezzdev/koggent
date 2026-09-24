import {
  Mic,
  Paperclip,
  Send,
  Loader2,
  Zap,
  MessageSquare,
  Code2,
  FileText,
  ImageIcon,
  Globe,
  Presentation,
} from "lucide-react";
import { useState } from "react";
import sendMessage from "../features/sendMessage";
import { createConversation } from "../features/createConversation";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, setArtifacts } from "../redux/messageSlice";
import {
  addConversation,
  setSelectedConversation,
  setConvTitle,
} from "../redux/conversationSlice";
import { updateConversation } from "../features/updateConversation";
import { setUserdata } from "../redux/userSlice";

function ChatInput() {
  const [value, setValue] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("auto");
  const [loading, setLoading] = useState(false);

  const { selectedConversation } = useSelector((state) => state.conversation);
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleSendMessage = async () => {
    const trimmed = value.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setValue("");
    dispatch(addMessage({ role: "user", content: trimmed }));

    try {
      let currentConv = selectedConversation;
      let convId = currentConv?._id;

      if (!convId) {
        currentConv = await createConversation();
        if (currentConv?._id) {
          dispatch(addConversation(currentConv));
          dispatch(setSelectedConversation(currentConv));
          convId = currentConv._id;
        }
      }

      if (currentConv?.title === "New Chat" && convId) {
        const newTitle = trimmed.slice(0, 40);
        await updateConversation({
          id: convId,
          title: newTitle,
          agent: selectedAgent,
        });
        dispatch(
          setConvTitle({
            conversationId: convId,
            title: newTitle,
          }),
        );
      }

      const payload = {
        prompt: trimmed,
        conversationId: convId,
        agent: selectedAgent.toLowerCase(),
      };

      const data = await sendMessage(payload);
      if (userData && data?.credits !== undefined) {
        dispatch(setUserdata({ ...userData, credits: data.credits }));
      }
      dispatch(setArtifacts(data?.artifacts || []));
      if (data?.answer) {
        dispatch(
          addMessage({
            role: "assistant",
            content: data.answer,
            images: data.images || [],
          }),
        );
      } else {
        dispatch(
          addMessage({
            role: "assistant",
            content:
              data?.message ||
              "Sorry, I encountered an issue generating a response.",
          }),
        );
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      dispatch(
        addMessage({
          role: "assistant",
          content: "Sorry, I encountered an error processing your request.",
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const agents = [
    {
      id: "auto",
      icon: Zap,
      label: "Auto",
    },
    {
      id: "chat",
      icon: MessageSquare,
      label: "Chat",
    },
    {
      id: "coding",
      icon: Code2,
      label: "Coding",
    },
    {
      id: "pdf",
      icon: FileText,
      label: "PDF",
    },
    {
      id: "ppt",
      icon: Presentation,
      label: "PPT",
    },
    {
      id: "vision",
      icon: ImageIcon,
      label: "Vision",
    },
    {
      id: "search",
      icon: Globe,
      label: "Search",
    },
  ];

  return (
    <div className="w-full overflow-hidden px-3 md:px-5 py-4 border-t border-white/[0.06] bg-[#0d0f14]">
      <div className="flex flex-col gap-2 bg-white/[0.03] border border-white/[0.07] rounded-2xl px-4 pt-3.5 pb-3">
        <div className="flex w-[80%] gap-2 pr-2 flex-wrap">
          {agents.map((agent) => {
            const isActive =
              selectedAgent.toLowerCase() === agent.id.toLowerCase();
            const Icon = agent.icon;

            return (
              <div
                key={agent.id}
                onClick={() => setSelectedAgent(agent.id)}
                className={`
                    flex-shrink-0
                    cursor-pointer
                    inline-flex
                    items-center
                    gap-1.5
                    px-3
                    py-2
                    rounded-full
                    text-xs
                    font-medium
                    border
                    transition-all
                    ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white border-transparent shadow-[0_1px_8px_rgba(99,102,241,.35)]"
                        : "bg-white/[0.03] text-slate-400 border-white/[0.06] hover:bg-white/[0.07]"
                    }
                `}
              >
                <Icon
                  size={14}
                  className={isActive ? "text-white" : "text-slate-500"}
                />

                {agent.label}
              </div>
            );
          })}
        </div>

        <textarea
          placeholder="Ask Anything..."
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          value={value}
          disabled={loading}
          className="w-full bg-transparent outline-none resize-none text-[14px] text-slate-200 placeholder:text-slate-600 leading-relaxed [scrollbar-width:none] [&::-webkit-scrollbar]:hidden disabled:opacity-50"
          rows={3}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all duration-150 bg-transparent cursor-pointer">
              <Paperclip size={16} />
            </button>

            <button className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all duration-150 bg-transparent cursor-pointer">
              <Mic size={16} />
            </button>
          </div>

          <button
            disabled={!value.trim() || loading}
            onClick={handleSendMessage}
            className={`flex items-center justify-center w-8 h-8 rounded-lg border-none cursor-pointer transition-all duration-150 ${
              value.trim() && !loading
                ? "bg-linear-to-br from-indigo-500 to-violet-700 hover:opacity-90 text-white"
                : "bg-white/[0.05] text-slate-600 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Send size={15} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;
