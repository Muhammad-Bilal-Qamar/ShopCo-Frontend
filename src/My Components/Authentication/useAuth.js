import { useState, useEffect, useCallback } from "react";
import {
    clearAuthState,
    readStoredToken,
    readStoredUser,
} from "../../utils/auth.js";

export default function useAuth() {
    const [user, setUser] = useState(() => readStoredUser());
    const [token, setToken] = useState(() => readStoredToken());

    useEffect(() => {
        const sync = () => {
            setUser(readStoredUser());
            setToken(readStoredToken());
        };
        window.addEventListener("authchange", sync);
        window.addEventListener("storage", sync);
        return () => {
            window.removeEventListener("authchange", sync);
            window.removeEventListener("storage", sync);
        };
    }, []);

    const isAuthenticated = Boolean(user && token);
    const isAdmin = user?.role?.toLowerCase() === "admin";

    const logout = useCallback(() => {
        clearAuthState();
    }, []);

    return { user, token, isAuthenticated, isAdmin, logout };
}