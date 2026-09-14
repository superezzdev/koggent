import { Mic, Paperclip, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import sendMessage from "../features/sendMessage";
import { createConversation } from "../features/createConversation";
import { useDispatch, useSelector } from "react-redux";
import { addMessages } from "../redux/messageSlice";
import { addConversation, setSelectedConversation } from "../redux/conversationSlice";

function ChatInput() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const { selectedConversation } = useSelector((state) => state.conversation);
  const dispatch = useDispatch();

  const handleSendMessage = async () => {
    const trimmed = value.trim();
    if (!trimmed || loading) return;

    let convId = selectedConversation?._id;

    setLoading(true);
    setValue("");
    dispatch(addMessages([{ role: "user", content: trimmed }]));

    try {
      if (!convId) {
        const newConv = await createConversation();
        if (newConv?._id) {
          dispatch(addConversation(newConv));
          dispatch(setSelectedConversation(newConv));
          convId = newConv._id;
        }
      }

      const payload = {
        prompt: trimmed,
        conversationId: convId,
      };

      const data = await sendMessage(payload);
      if (data) {
        dispatch(addMessages([{ role: "assistant", content: data }]));
      } else {
        dispatch(
          addMessages([
            {
              role: "assistant",
              content: "Sorry, I encountered an issue generating a response.",
            },
          ])
        );
      }
    } catch (err) {
      console.error("Failed to send message:", err);
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

  return (
    <div className="w-full overflow-hidden px-3 md:px-5 py-4 border-t border-white/[0.06] bg-[#0d0f14]">
      <div className="flex flex-col gap-2 bg-white/[0.03] border border-white/[0.07] rounded-2xl px-4 pt-3.5 pb-3">
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
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;
