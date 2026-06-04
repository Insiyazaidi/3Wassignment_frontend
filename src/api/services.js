import api from "./axios";

// ─── Auth API ─────────────────────────────────────────────────────────────────

/**
 * Register a new user account
 * @param {{ username, email, password }} data
 */
export const signupApi = async (data) => {
  const response = await api.post("/auth/signup", data);
  return response.data;
};

/**
 * Login with email and password
 * @param {{ email, password }} data
 */
export const loginApi = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

/**
 * Fetch current authenticated user profile
 */
export const getMeApi = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

// ─── Posts API ────────────────────────────────────────────────────────────────

/**
 * Fetch paginated feed
 * @param {number} page
 * @param {number} limit
 */
export const getFeedApi = async (page = 1, limit = 10) => {
  const response = await api.get(`/posts?page=${page}&limit=${limit}`);
  return response.data;
};

/**
 * Create a new post with text and/or image
 * @param {FormData} formData - Contains 'content' text and optional 'image' file
 */
export const createPostApi = async (formData) => {
  const response = await api.post("/posts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

/**
 * Delete a post by ID
 * @param {string} postId
 */
export const deletePostApi = async (postId) => {
  const response = await api.delete(`/posts/${postId}`);
  return response.data;
};

/**
 * Toggle like/unlike on a post
 * @param {string} postId
 */
export const toggleLikeApi = async (postId) => {
  const response = await api.put(`/posts/${postId}/like`);
  return response.data;
};

/**
 * Add a comment to a post
 * @param {string} postId
 * @param {string} text
 */
export const addCommentApi = async (postId, text) => {
  const response = await api.post(`/posts/${postId}/comments`, { text });
  return response.data;
};

/**
 * Delete a comment from a post
 * @param {string} postId
 * @param {string} commentId
 */
export const deleteCommentApi = async (postId, commentId) => {
  const response = await api.delete(`/posts/${postId}/comments/${commentId}`);
  return response.data;
};
