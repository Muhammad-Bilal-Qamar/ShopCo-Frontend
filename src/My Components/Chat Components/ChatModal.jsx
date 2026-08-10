import { useEffect, useRef, useState } from "react";
import { getOrCreateMyChat, getChatHistory } from "./chatApi";
import {
  startChatConnection,
  getChatConnection,
  stopChatConnection,
} from "./signalRConnection";
import { sendCustomerAiMessage } from "./aiChatApi";
import AiChatPanel from "./AiChatPanel";
import useAuth from "../Authentication/useAuth";

const ChatModal = ({ onClose, aiMessages, setAiMessages }) => {
  const { user, isAuthenticated } = useAuth();
  const [mode, setMode] = useState("ai"); // "ai" | "human" — AI Support is the default state
  const [chatId, setChatId] = useState(null);
  const [adminId, setAdminId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  // Purge chat state (AI session + human chat socket) as soon as the user logs out.
  // Note: the AI session (aiMessages) is owned by the parent (FloatingChatButton)
  // so that it survives this modal being closed/reopened, and is purged there.
  useEffect(() => {
    if (!isAuthenticated) {
      setMessages([]);
      setChatId(null);
      setAdminId(null);
      stopChatConnection();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (mode !== "human") return;
    let active = true;

    const init = async () => {
      try {
        const chat = await getOrCreateMyChat();
        if (!active) return;
        setChatId(chat.chatId);
        setAdminId(chat.adminId);

        const history = await getChatHistory(chat.chatId);
        if (!active) return;
        setMessages(history);

        const connection = await startChatConnection();
        if (!active) return;

        connection.off("ReceiveMessage");
        connection.on("ReceiveMessage", (senderId, message) => {
          if (!active) return;
          setMessages((prev) => [
            ...prev,
            {
              messageId: `local-${Date.now()}`,
              chatId: chat.chatId,
              senderId,
              receiverId: user.id,
              message,
              timeOfMessage: new Date().toISOString(),
            },
          ]);
        });

        connection.onreconnecting(() => setConnected(false));
        connection.onreconnected(() => setConnected(true));
        connection.onclose(() => setConnected(false));

        setConnected(true); // only now is the socket actually usable
      } catch (err) {
        console.error(err);
        if (active) setError("Unable to load chat. Please try again.");
      } finally {
        if (active) setLoading(false);
      }
    };

    init();
    return () => {
      active = false;
    };
  }, [user?.id, mode]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !chatId || !adminId || !connected) return;

    try {
      const connection = getChatConnection();
      await connection.invoke("SendMessage", chatId, user.id, adminId, text);
      setMessages((prev) => [
        ...prev,
        {
          messageId: `local-${Date.now()}`,
          chatId,
          senderId: user.id,
          receiverId: adminId,
          message: text,
          timeOfMessage: new Date().toISOString(),
        },
      ]);
      setDraft("");
    } catch (err) {
      console.error(err);
      setError("Message failed to send.");
    }
  };

  return (
    <div className="mb-4 w-80 sm:w-96 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
      <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
        <h3 className="font-semibold text-sm">Support Chat</h3>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white text-xl leading-none"
        >
          &times;
        </button>
      </div>

      <div className="px-3 py-2 border-b border-gray-200 bg-white">
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="w-full text-xs font-medium border border-gray-300 rounded-md px-2 py-1.5 text-gray-700 focus:outline-none focus:border-blue-500"
          aria-label="Chat mode"
        >
          <option value="ai">AI Assistant</option>
          <option value="human">Human Support</option>
        </select>
      </div>

      {mode === "ai" ? (
        <AiChatPanel
          sendMessage={(text, history) => sendCustomerAiMessage(text, history)}
          accent="blue"
          messages={aiMessages}
          setMessages={setAiMessages}
        />
      ) : (
        <>
          <div className="flex-1 p-4 bg-gray-50 overflow-y-auto text-sm space-y-2">
            {loading && (
              <p className="text-gray-400 text-center mt-10">Loading chat…</p>
            )}
            {error && <p className="text-red-500 text-center">{error}</p>}
            {!loading && !error && messages.length === 0 && (
              <p className="text-gray-400 text-center mt-10">
                Say hello to start the conversation.
              </p>
            )}
            {messages.map((m) => {
              const isMine = m.senderId === user?.id;
              return (
                <div
                  key={m.messageId}
                  className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-3 py-2 rounded-lg max-w-[80%] break-words ${
                      isMine
                        ? "bg-blue-600 text-white"
                        : "bg-blue-100 text-blue-900"
                    }`}
                  >
                    {m.message}
                  </div>
                </div>
              );
            })}
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
              placeholder={connected ? "Type a message…" : "Connecting…"}
              disabled={!connected}
              className="flex-1 border border-gray-300 rounded-l-md px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
            />
            <button
              type="submit"
              disabled={!connected}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-1.5 rounded-r-md text-sm font-medium"
            >
              Send
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default ChatModal;
