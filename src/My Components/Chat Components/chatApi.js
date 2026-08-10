import axios from "axios";

const getToken = () => localStorage.getItem("token");

const client = () =>
    axios.create({
        baseURL: "/api",
        headers: {
            "Content-Type": "application/json",
            ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
        },
    });

// GET /api/chats/mine -> { chatId, userId, adminId }
export const getOrCreateMyChat = async () => {
    const res = await client().get("/chats/mine");
    return res.data;
};

// GET /api/chats/history/{chatId} -> ChatMessage[]
export const getChatHistory = async (chatId) => {
    const res = await client().get(`/chats/history/${chatId}`);
    return res.data;
};

// GET /api/chats/active -> [{ chatId, userId, userName, lastMessageTime }] (admin only)
export const getActiveChats = async () => {
    const res = await client().get("/chats/active");
    return res.data;
};