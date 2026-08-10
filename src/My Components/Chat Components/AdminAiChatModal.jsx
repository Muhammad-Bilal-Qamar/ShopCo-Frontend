import { sendAdminAiMessage } from "./aiChatApi";
import AiChatPanel from "./AiChatPanel";

const AdminAiChatModal = ({ onClose, messages, setMessages }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md h-[32rem] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
        <div className="bg-purple-600 text-white px-4 py-3 flex justify-between items-center">
          <h3 className="font-semibold text-sm">Admin AI Assistant</h3>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-xl leading-none"
          >
            &times;
          </button>
        </div>

        <AiChatPanel
          sendMessage={(text, history) => sendAdminAiMessage(text, history)}
          accent="purple"
          placeholder="Ask about users, products, carts, or metrics…"
          messages={messages}
          setMessages={setMessages}
        />
      </div>
    </div>
  );
};

export default AdminAiChatModal;
