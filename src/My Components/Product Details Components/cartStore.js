import axios from "axios";

const CART_CHANGE_EVENT = "cartchange";

// In-memory cache to replace localStorage. 
// This keeps the UI fast while ensuring the DB is the source of truth.
let cartCache = [];

// Helper to get auth details needed for the API calls
const getAuth = () => {
    const storedUser = JSON.parse(localStorage.getItem("ecomm_user") || "null");
    const token = localStorage.getItem("token");
    
    // Safely find the userId regardless of the object structure
    const userId =
        storedUser?.id ??
        storedUser?.userId ??
        storedUser?.UserId ??
        storedUser?.user?.id ??
        storedUser?.user?.userId ??
        storedUser?.user?.UserId ??
        null;
        
    return { userId, token };
};

// Axios instance with auth token attached
const apiClient = () => {
    const { token } = getAuth();
    return axios.create({
        baseURL: "/api",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
};

// Notify React components that the cart state has changed
const emitCartChange = () => {
    window.dispatchEvent(new Event(CART_CHANGE_EVENT));
};

// Fetches the cart from the DB, updates the in-memory cache, and triggers UI sync
export const fetchCart = async () => {
    const { userId } = getAuth();
    if (!userId) {
        cartCache = [];
        emitCartChange();
        return [];
    }

    try {
        // Calls: GET /api/carts/{userId}
        const response = await apiClient().get(`/carts/${userId}`);
        cartCache = response.data.items || [];
        emitCartChange();
        return cartCache;
    } catch (error) {
        console.error("Failed to fetch cart from DB:", error);
        return cartCache;
    }
};

export const getCart = () => cartCache;

export const getCartQuantity = (productId) => {
    const item = cartCache.find((entry) => entry.productId === productId);
    return item ? item.quantity : 0;
};

export const getCartCount = () =>
    cartCache.reduce((total, item) => total + item.quantity, 0);

// Adds item to DB.
// Matches C# Controller: [HttpPost("{userId}/add")] expecting CartItemRequestDto { ProductId, Quantity }
export const addToCart = async (product, quantity = 1) => {
    const { userId } = getAuth();
    if (!userId) throw new Error("Must be logged in to add to cart");

    const safeQuantity = Math.max(1, quantity);
    const payload = {
        ProductId: product.id ?? product.productId, // C# DTO expects PascalCase
        Quantity: safeQuantity
    };

    try {
        await apiClient().post(`/carts/${userId}/add`, payload);
        await fetchCart(); // Re-fetch to update cache and UI with DB truth
        return safeQuantity;
    } catch (error) {
        console.error("Failed to add to cart:", error);
        throw error;
    }
};

// Updates quantity using the CartItem's unique DB ID.
// Matches C# Controller: [HttpPut("items/{cartItemId}")] expecting raw int body
export const setQuantity = async (product, quantity) => {
    const safeQuantity = Math.max(1, quantity);
    const productId = product.id ?? product.productId;
    const cartItem = cartCache.find((entry) => entry.productId === productId);
    
    if (!cartItem || !cartItem.id) {
        console.error("Cannot update: Cart item ID not found in cache. Item might not be in DB yet.");
        return;
    }

    try {
        // C# Controller expects the new quantity as a raw integer body
        await apiClient().put(`/carts/items/${cartItem.id}`, safeQuantity, {
            headers: { "Content-Type": "application/json" }
        });
        await fetchCart();
        return safeQuantity;
    } catch (error) {
        console.error("Failed to update quantity:", error);
        throw error;
    }
};

export const changeQuantity = async (product, delta) => {
    const current = getCartQuantity(product.id ?? product.productId) || 0;
    const base = current > 0 ? current : 1;
    return setQuantity(product, base + delta);
};

// Deletes item using the CartItem's unique DB ID.
// Matches C# Controller: [HttpDelete("items/{cartItemId}")]
export const removeFromCart = async (productId) => {
    const cartItem = cartCache.find((entry) => entry.productId === productId);
    
    if (!cartItem || !cartItem.id) {
        console.error("Cannot remove: Cart item ID not found in cache.");
        return;
    }

    try {
        await apiClient().delete(`/carts/items/${cartItem.id}`);
        await fetchCart();
    } catch (error) {
        console.error("Failed to remove from cart:", error);
        throw error;
    }
};

// Replaces localStorage hydration. Fetches from DB on app load.
export const hydrateCart = async () => {
    await fetchCart();
};
