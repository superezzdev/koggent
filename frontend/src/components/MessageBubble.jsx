
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

function MessageBubble({ role, content }) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[72%] px-4 py-2.5 rounded-2xl text-[13.5px] leading-relaxed break-words
          ${
            isUser
              ? "bg-gradient-to-br from-indigo-500 to-violet-700 text-white rounded-tr-sm"
              : "bg-white/[0.04] border border-white/[0.07] text-slate-200 rounded-tl-sm"
          }`}
      >
        <div className="markdown prose prose-invert max-w-none text-inherit leading-relaxed">
          <Markdown remarkPlugins={[remarkGfm]}>{content || ""}</Markdown>
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
