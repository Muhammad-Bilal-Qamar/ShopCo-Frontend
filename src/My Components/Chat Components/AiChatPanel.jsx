import { useEffect, useRef, useState } from "react";

/**
 * Presentational + stateful AI chat panel.
 * History lives only in React state (session-scoped) — never written to
 * localStorage/sessionStorage.
 *
 * Message state can either be owned internally (uncontrolled — history is
 * lost whenever this component unmounts, e.g. when a modal closes) or
 * lifted up via the `messages`/`setMessages` props (controlled — history
 * survives the modal being closed/reopened and only needs to be cleared
 * explicitly, e.g. on logout, by the parent that owns the state).
 */
const AiChatPanel = ({
  sendMessage,
  accent = "blue",
  placeholder = "Ask about products, your cart, or policies…",
  messages: controlledMessages,
  setMessages: setControlledMessages,
}) => {
  const [internalMessages, setInternalMessages] = useState([]); // { role: 'user' | 'assistant', content }
  const isControlled = controlledMessages !== undefined && setControlledMessages !== undefined;
  const messages = isControlled ? controlledMessages : internalMessages;
  const setMessages = isControlled ? setControlledMessages : setInternalMessages;
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || sending) return;

    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setDraft("");
    setError("");
    setSending(true);

    try {
      // Send prior history (excluding the message we just appended) alongside the new message.
      const { reply } = await sendMessage(text, messages);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error(err);
      setError("The assistant couldn't respond. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const bubbleColor = accent === "purple" ? "bg-purple-600" : "bg-blue-600";
  const focusColor =
    accent === "purple" ? "focus:border-purple-500" : "focus:border-blue-500";

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 bg-gray-50 overflow-y-auto text-sm space-y-2">
        {messages.length === 0 && (
          <p className="text-gray-400 text-center mt-10">
            Ask me anything about products, your cart, or store policies.
          </p>
        )}
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-3 py-2 rounded-lg max-w-[80%] break-words whitespace-pre-wrap ${
                m.role === "user"
                  ? `${bubbleColor} text-white`
                  : "bg-white border border-gray-200 text-gray-800"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-400 text-xs">
              Assistant is typing…
            </div>
          </div>
        )}
        {error && <p className="text-red-500 text-center text-xs">{error}</p>}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="p-3 border-t border-gray-200 flex bg-white"
      >
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
          disabled={sending}
          className={`flex-1 border border-gray-300 rounded-l-md px-3 py-1.5 text-sm focus:outline-none ${focusColor} disabled:bg-gray-100`}
        />
        <button
          type="submit"
          disabled={sending || !draft.trim()}
          className={`${bubbleColor} hover:opacity-90 disabled:bg-gray-300 text-white px-4 py-1.5 rounded-r-md text-sm font-medium`}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default AiChatPanel;
