import {
  Mic,
  MicOff,
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
  X,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import sendMessage from "../features/sendMessage";
import { createConversation } from "../features/createConversation";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, setArtifacts, setIsLoading } from "../redux/messageSlice";
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
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState(null);

  const { selectedConversation } = useSelector((state) => state.conversation);
  const { userData } = useSelector((state) => state.user);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  const baseTextRef = useRef("");
  const errorTimeoutRef = useRef(null);

  const isSpeechSupported =
    typeof window !== "undefined" &&
    Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

  const showError = (msg) => {
    setSpeechError(msg);
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }
    errorTimeoutRef.current = setTimeout(() => {
      setSpeechError(null);
    }, 5000);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Recognition already stopped
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
    isListeningRef.current = false;
  };

  const startListening = () => {
    if (!isSpeechSupported) {
      showError(
        "Speech recognition is not supported in this browser. Try Chrome, Edge, or Safari."
      );
      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // Previous instance abort
      }
      recognitionRef.current = null;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang =
        (typeof navigator !== "undefined" && navigator.language) || "en-US";

      baseTextRef.current = value;

      recognition.onstart = () => {
        setIsListening(true);
        isListeningRef.current = true;
        setSpeechError(null);
      };

      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
          const part = event.results[i][0]?.transcript || "";
          if (transcript && !transcript.endsWith(" ") && !part.startsWith(" ")) {
            transcript += " " + part;
          } else {
            transcript += part;
          }
        }
        transcript = transcript.trim();

        const base = baseTextRef.current;
        if (base) {
          const needsSpace =
            !base.endsWith(" ") && !base.endsWith("\n") && transcript.length > 0;
          setValue(`${base}${needsSpace ? " " : ""}${transcript}`);
        } else {
          setValue(transcript);
        }

        if (textareaRef.current) {
          textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        }
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        if (
          event.error === "not-allowed" ||
          event.error === "service-not-allowed"
        ) {
          showError("Microphone access denied. Please allow microphone permissions.");
          stopListening();
        } else if (event.error === "audio-capture") {
          showError("No microphone detected. Please check your audio settings.");
          stopListening();
        } else if (event.error === "network") {
          showError("Network error during speech recognition. Please try again.");
          stopListening();
        } else if (event.error !== "no-speech") {
          showError(`Speech recognition error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        isListeningRef.current = false;
        recognitionRef.current = null;
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);
      isListeningRef.current = true;
      textareaRef.current?.focus();
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      setIsListening(false);
      isListeningRef.current = false;
      recognitionRef.current = null;
      showError("Unable to access microphone. Please try again.");
    }
  };

  const toggleListening = () => {
    if (loading) return;
    if (isListeningRef.current) {
      stopListening();
    } else {
      startListening();
    }
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Unmount cleanup
        }
      }
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  const handleClearFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const handleFileSelect = (file) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }
    setSelectedFile(file);
    const isImage =
      file.type?.startsWith("image/") ||
      /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file.name || "");
    if (isImage) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const dispatch = useDispatch();

  const handleSendMessage = async () => {
    if (isListeningRef.current) {
      stopListening();
    }
    const trimmed = value.trim();
    if ((!trimmed && !selectedFile) || loading) return;

    baseTextRef.current = "";
    dispatch(setIsLoading(true));
    setLoading(true);
    setValue("");

    const promptText =
      trimmed ||
      (selectedFile
        ? selectedFile.type === "application/pdf"
          ? "Please analyze this PDF document."
          : "Please analyze this image."
        : "");

    dispatch(addMessage({ role: "user", content: promptText }));

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
        const newTitle = (trimmed || promptText).slice(0, 40);
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

      let data;
      if (selectedFile) {
        const formData = new FormData();
        formData.append("prompt", promptText);
        formData.append("conversationId", convId || "");
        formData.append("agent", selectedAgent.toLowerCase());
        formData.append("file", selectedFile);
        data = await sendMessage(formData);
      } else {
        const payload = {
          prompt: promptText,
          conversationId: convId,
          agent: selectedAgent.toLowerCase(),
        };
        data = await sendMessage(payload);
      }

      dispatch(setIsLoading(false));

      handleClearFile();
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
      dispatch(setIsLoading(false));
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
        <div className="flex w-full gap-2 pb-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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

        {selectedFile && (
          <div className="my-2">
            <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
              {selectedFile?.type === "application/pdf" ||
              selectedFile?.name?.toLowerCase().endsWith(".pdf") ? (
                <FileText size={18} className="text-red-400 shrink-0" />
              ) : previewUrl ? (
                <img
                  src={previewUrl}
                  alt="preview"
                  className="h-8 w-8 rounded-lg object-cover shrink-0"
                />
              ) : (
                <ImageIcon size={18} className="text-blue-400 shrink-0" />
              )}
              <div className="max-w-[180px] sm:max-w-[260px]">
                <p className="text-xs text-white truncate">{selectedFile?.name}</p>

                <p className="text-[10px] text-slate-500">
                  {Math.ceil(selectedFile.size / 1024)}KB
                </p>
              </div>

              <button
                type="button"
                className="ml-2 cursor-pointer p-1 rounded hover:bg-white/[0.06] text-slate-500 hover:text-white transition-colors"
                onClick={handleClearFile}
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        <textarea
          ref={textareaRef}
          placeholder={isListening ? "Listening... Speak now..." : "Ask Anything..."}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          value={value}
          disabled={loading}
          className="w-full bg-transparent outline-none resize-none text-[14px] text-slate-200 placeholder:text-slate-600 leading-relaxed [scrollbar-width:none] [&::-webkit-scrollbar]:hidden disabled:opacity-50"
          rows={3}
        />

        {speechError && (
          <div className="flex items-center justify-between gap-2 px-3 py-1.5 mb-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
            <span className="truncate">{speechError}</span>
            <button
              type="button"
              onClick={() => setSpeechError(null)}
              className="text-amber-400 hover:text-white p-0.5 rounded cursor-pointer"
            >
              <X size={12} />
            </button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <input
              type="file"
              accept=".pdf,image/*"
              hidden
              ref={fileRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFileSelect(file);
                }
              }}
            />

            <button
              type="button"
              className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all duration-150 bg-transparent cursor-pointer"
              onClick={() => fileRef.current?.click()}
            >
              <Paperclip size={16} />
            </button>

            <button
              type="button"
              onClick={toggleListening}
              disabled={loading}
              title={
                !isSpeechSupported
                  ? "Speech recognition is not supported in this browser"
                  : isListening
                  ? "Stop listening"
                  : "Voice typing"
              }
              className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-all duration-150 cursor-pointer ${
                isListening
                  ? "bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.35)]"
                  : "text-slate-600 hover:text-slate-400 hover:bg-white/[0.05] border-transparent hover:border-white/[0.06] bg-transparent"
              } ${loading ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              {isListening ? (
                <MicOff size={16} className="text-rose-400 animate-pulse" />
              ) : (
                <Mic size={16} />
              )}
            </button>

            {isListening && (
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/25 text-[11px] font-medium text-rose-300 shadow-sm animate-pulse">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
                <span className="hidden sm:inline">Listening...</span>
                <div className="flex items-center gap-0.5">
                  <span className="w-0.5 h-2.5 bg-rose-400 rounded-full animate-pulse"></span>
                  <span className="w-0.5 h-4 bg-rose-400 rounded-full animate-pulse"></span>
                  <span className="w-0.5 h-2 bg-rose-400 rounded-full animate-pulse"></span>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            disabled={(!value.trim() && !selectedFile) || loading}
            onClick={handleSendMessage}
            className={`flex items-center justify-center w-8 h-8 rounded-lg border-none cursor-pointer transition-all duration-150 ${
              (value.trim() || selectedFile) && !loading
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
