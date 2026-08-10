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

// history: [{ role: "user" | "assistant", content: string }]
// Session-only — never persisted to localStorage, kept in React state and
// cleared on unmount / logout by the calling component.
export const sendCustomerAiMessage = async (message, history = []) => {
    const res = await client().post("/aichat/customer", { message, history });
    return res.data; // { reply, refused }
};

export const sendAdminAiMessage = async (message, history = []) => {
    const res = await client().post("/aichat/admin", { message, history });
    return res.data; // { reply, refused }
};