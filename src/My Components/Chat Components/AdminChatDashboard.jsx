import { useEffect, useRef, useState } from "react";
import { getActiveChats, getChatHistory } from "./chatApi";
import {
  startChatConnection,
  getChatConnection,
  stopChatConnection,
} from "./signalRConnection";
import useAuth from "../Authentication/useAuth";
import Navbar from "../HomePage Components/Navbar.jsx";
import AdminAiChatModal from "./AdminAiChatModal.jsx";

const AdminChatDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [connected, setConnected] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  // Owned here (not inside AdminAiChatModal) so the AI conversation survives
  // the modal being closed/reopened — it should only be cleared on logout.
  const [aiMessages, setAiMessages] = useState([]);
  const bottomRef = useRef(null);
  const selectedChatRef = useRef(null);

  // Purge local chat state + human-chat socket on logout.
  useEffect(() => {
    if (!isAuthenticated) {
      setSelectedChat(null);
      setMessages([]);
      setAiAssistantOpen(false);
      setAiMessages([]);
      stopChatConnection();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  const refreshChats = async () => {
    try {
      const data = await getActiveChats();
      setChats(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let active = true;

    const init = async () => {
      setLoadingChats(true);
      await refreshChats();
      if (active) setLoadingChats(false);

      const connection = await startChatConnection();
      if (!active) return;

      connection.off("ReceiveMessage");
      connection.on("ReceiveMessage", (senderId, message) => {
        const current = selectedChatRef.current;
        if (current && senderId === current.userId) {
          setMessages((prev) => [
            ...prev,
            {
              messageId: `local-${Date.now()}`,
              chatId: current.chatId,
              senderId,
              receiverId: user.id,
              message,
              timeOfMessage: new Date().toISOString(),
            },
          ]);
        } else {
          refreshChats();
        }
      });

      connection.onreconnecting(() => setConnected(false));
      connection.onreconnected(() => setConnected(true));
      connection.onclose(() => setConnected(false));

      setConnected(true);
    };

    init();
    return () => {
      active = false;
    };
  }, [user?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const openChat = async (chat) => {
    setSelectedChat(chat);
    setLoadingMessages(true);
    try {
      const history = await getChatHistory(chat.chatId);
      setMessages(history);
    } catch (err) {
      console.error(err);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !selectedChat || !connected) return;

    try {
      const connection = getChatConnection();
      await connection.invoke(
        "SendMessage",
        selectedChat.chatId,
        user.id,
        selectedChat.userId,
        text,
      );
      setMessages((prev) => [
        ...prev,
        {
          messageId: `local-${Date.now()}`,
          chatId: selectedChat.chatId,
          senderId: user.id,
          receiverId: selectedChat.userId,
          message: text,
          timeOfMessage: new Date().toISOString(),
        },
      ]);
      setDraft("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F6F6] flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`w-full sm:w-72 border-r border-gray-200 bg-white flex-shrink-0 flex-col ${
            selectedChat ? "hidden sm:flex" : "flex"
          }`}
        >
          <div className="px-4 py-4 border-b border-gray-200 flex items-center justify-between gap-2">
            <h2 className="text-lg font-black text-black">Support Chats</h2>
            <button
              onClick={() => setAiAssistantOpen(true)}
              className="text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-md whitespace-nowrap"
            >
              AI Assistant
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loadingChats && (
              <p className="p-4 text-sm text-gray-400">Loading chats…</p>
            )}
            {!loadingChats && chats.length === 0 && (
              <p className="p-4 text-sm text-gray-400">No active chats yet.</p>
            )}
            {chats.map((chat) => (
              <button
                key={chat.chatId}
                onClick={() => openChat(chat)}
                className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 ${
                  selectedChat?.chatId === chat.chatId ? "bg-blue-50" : ""
                }`}
              >
                <p className="text-sm font-semibold text-black truncate">
                  {chat.userName}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {chat.lastMessageTime
                    ? new Date(chat.lastMessageTime).toLocaleString()
                    : "No messages yet"}
                </p>
              </button>
            ))}
          </div>
        </aside>

        <section
          className={`flex-1 flex-col ${selectedChat ? "flex" : "hidden sm:flex"}`}
        >
          {!selectedChat && (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
              Select a conversation to get started
            </div>
          )}

          {selectedChat && (
            <>
              <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center gap-3">
                <button
                  onClick={() => setSelectedChat(null)}
                  className="sm:hidden text-gray-500"
                >
                  &larr;
                </button>
                <h3 className="font-semibold text-black">
                  {selectedChat.userName}
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-2">
                {loadingMessages && (
                  <p className="text-gray-400 text-center mt-10 text-sm">
                    Loading messages…
                  </p>
                )}
                {!loadingMessages &&
                  messages.map((m) => {
                    const isMine = m.senderId === user?.id;
                    return (
                      <div
                        key={m.messageId}
                        className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`px-3 py-2 rounded-lg max-w-[70%] text-sm break-words ${
                            isMine
                              ? "bg-purple-600 text-white"
                              : "bg-white border border-gray-200 text-gray-800"
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
                  placeholder={connected ? "Reply to customer…" : "Connecting…"}
                  disabled={!connected}
                  className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:border-purple-500 disabled:bg-gray-100"
                />
                <button
                  type="submit"
                  disabled={!connected}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-r-md text-sm font-medium"
                >
                  Send
                </button>
              </form>
            </>
          )}
        </section>
      </div>

      {aiAssistantOpen && (
        <AdminAiChatModal
          onClose={() => setAiAssistantOpen(false)}
          messages={aiMessages}
          setMessages={setAiMessages}
        />
      )}
    </div>
  );
};

export default AdminChatDashboard;
