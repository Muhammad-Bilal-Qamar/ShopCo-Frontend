import axios from "axios";
import {
    clearAuthState,
    getUserAvatarSource,
    getUserId,
    readStoredToken,
    readStoredUser,
    saveAuthState,
    updateStoredUser,
} from "../utils/auth.js";

const client = () =>
    axios.create({
        baseURL: "/api",
        headers: {
            "Content-Type": "application/json",
            ...(readStoredToken() ? { Authorization: `Bearer ${readStoredToken()}` } : {}),
        },
    });

export const getAuthSnapshot = () => ({
    user: readStoredUser(),
    token: readStoredToken(),
    userId: getUserId(),
});

export const getProducts = async () => {
    const response = await client().get("/products");
    const data = response.data;

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.products)) return data.products;

    return [];
};

export const getProduct = async (productId) => {
    const response = await client().get(`/products/${productId}`);
    return response.data;
};

const buildProductFormData = (payload) => {
    // Backend contract: ProductCreateUpdateDto (Title, Description, Category, Price, Quantity)
    // + separate [FromForm] IFormFile? image parameter
    const formData = new FormData();
    const fieldPairs = [
        ["Title", payload.title],
        ["Description", payload.description],
        ["Price", payload.price],
        ["Quantity", payload.stock], // DTO field is "Quantity", not "Stock"
        ["Category", payload.category],
    ];

    fieldPairs.forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            formData.append(key, value);
        }
    });

    if (payload.imageFile) {
        formData.append("image", payload.imageFile);
    }

    return formData;
};

export const createProduct = async (payload) => {
    // Backend contract: POST /api/admin/products (AdminProductsController.Create)
    // [Authorize(Roles = "Admin")], [Consumes("multipart/form-data")]
    // [FromForm] ProductCreateUpdateDto dto, [FromForm] IFormFile? image
    const formData = buildProductFormData(payload);

    const response = await axios.post("/api/admin/products", formData, {
        headers: {
            ...(readStoredToken() ? { Authorization: `Bearer ${readStoredToken()}` } : {}),
        },
    });

    return response.data;
};

export const updateProduct = async (productId, payload) => {
    // Backend contract: PUT /api/admin/products/{id} (AdminProductsController.Update)
    // [Authorize(Roles = "Admin")], [Consumes("multipart/form-data")]
    // [FromForm] ProductCreateUpdateDto dto, [FromForm] IFormFile? image
    // Image is optional on update - only sent if the admin picked a new file.
    const formData = buildProductFormData(payload);

    const response = await axios.put(`/api/admin/products/${productId}`, formData, {
        headers: {
            ...(readStoredToken() ? { Authorization: `Bearer ${readStoredToken()}` } : {}),
        },
    });

    return response.data;
};

export const deleteProduct = async (productId) => {
    const response = await client().delete(`/products/${productId}`);
    return response.data;
};

export const uploadProfilePicture = async (file) => {
    // Backend contract: POST /api/users/profile-picture
    // [HttpPost("profile-picture")] UploadProfilePicture([FromForm] IFormFile file)
    // The multipart field name MUST be "file" - that's what ASP.NET model-binds to.
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post("/api/users/profile-picture", formData, {
        headers: {
            ...(readStoredToken() ? { Authorization: `Bearer ${readStoredToken()}` } : {}),
        },
    });

    // Backend returns: Ok(new { Url = url }) -> serialized as { url: "..." }
    const url = response.data?.url;

    const current = readStoredUser() || {};
    const nextUser = {
        ...current,
        profilePictureUrl: url || getUserAvatarSource(current),
    };

    updateStoredUser(() => nextUser);
    saveAuthState({ user: nextUser });
    return nextUser;
};

export const logout = () => {
    clearAuthState();
};