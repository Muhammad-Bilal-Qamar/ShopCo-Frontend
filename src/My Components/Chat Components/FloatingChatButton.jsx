import { useEffect, useState } from "react";
import useAuth from "../Authentication/useAuth";
import AuthPromptModal from "../Authentication/AuthPromptModal";
import ChatModal from "./ChatModal";

const FloatingChatButton = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [chatOpen, setChatOpen] = useState(false);
  const [promptOpen, setPromptOpen] = useState(false);
  // Owned here (not inside ChatModal) so the AI conversation survives the
  // modal being closed/reopened — it should only be cleared on logout.
  const [aiMessages, setAiMessages] = useState([]);

  // Purge the AI session as soon as the user logs out.
  useEffect(() => {
    if (!isAuthenticated) {
      setAiMessages([]);
    }
  }, [isAuthenticated]);

  // Admins get their chat entry points inside the admin dashboard itself
  // (Support Chats list + AI Assistant button), so skip the floating
  // button entirely for them to avoid overlapping the dashboard UI.
  if (isAdmin) {
    return null;
  }

  const handleClick = () => {
    if (!isAuthenticated) {
      setPromptOpen(true);
      return;
    }
    setChatOpen((prev) => !prev);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans flex flex-col items-end">
      {chatOpen && isAuthenticated && (
        <ChatModal
          onClose={() => setChatOpen(false)}
          aiMessages={aiMessages}
          setAiMessages={setAiMessages}
        />
      )}

      <button
        onClick={handleClick}
        aria-label="Open support chat"
        className="relative z-10 flex items-center justify-center w-14 h-14 rounded-full text-white shadow-lg transition-colors duration-200 bg-blue-600 hover:bg-blue-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>

      <AuthPromptModal
        open={promptOpen}
        onClose={() => setPromptOpen(false)}
        message="Please log in to chat with our support team."
      />
    </div>
  );
};

export default FloatingChatButton;
