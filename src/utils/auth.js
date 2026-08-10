const AUTH_USER_KEY = "ecomm_user";
const AUTH_TOKEN_KEY = "token";

export const readStoredUser = () => {
    try {
        return JSON.parse(localStorage.getItem(AUTH_USER_KEY) || "null");
    } catch {
        return null;
    }
};

export const readStoredToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

export const emitAuthChange = () => {
    window.dispatchEvent(new Event("authchange"));
};

export const saveAuthState = ({ user, token } = {}) => {
    if (user !== undefined) {
        if (user) {
            localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(AUTH_USER_KEY);
        }
    }

    if (token !== undefined) {
        if (token) {
            localStorage.setItem(AUTH_TOKEN_KEY, token);
        } else {
            localStorage.removeItem(AUTH_TOKEN_KEY);
        }
    }

    emitAuthChange();
};

export const updateStoredUser = (updater) => {
    const currentUser = readStoredUser();
    const nextUser =
        typeof updater === "function" ? updater(currentUser) : { ...currentUser, ...updater };

    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser));
    emitAuthChange();
    return nextUser;
};

export const clearAuthState = () => {
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    emitAuthChange();
};

export const getUserId = (user = readStoredUser()) => {
    return (
        user?.id ??
        user?.userId ??
        user?.UserId ??
        user?.user?.id ??
        user?.user?.userId ??
        user?.user?.UserId ??
        null
    );
};

export const getUserAvatarSource = (user) => {
    const candidate =
        user?.profilePictureUrl ??
        user?.profilePicture ??
        user?.avatarUrl ??
        user?.avatar ??
        user?.photoUrl ??
        user?.imageUrl ??
        user?.image ??
        "";

    if (!candidate || typeof candidate !== "string") {
        return "";
    }

    const trimmed = candidate.trim();
    if (!trimmed) return "";
    if (/^(https?:)?\/\//i.test(trimmed) || trimmed.startsWith("data:") || trimmed.startsWith("blob:")) {
        return trimmed;
    }

    return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
};

export const getUserInitials = (user) => {
    const source = user?.name || user?.fullName || user?.email || "";
    const parts = source
        .split(/\s+/)
        .map((part) => part.trim())
        .filter(Boolean);

    if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }

    return "U";
};
