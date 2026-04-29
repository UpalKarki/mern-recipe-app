const BASE_URL = 'http://localhost:5001/api';

// ── AUTH HELPERS ───────────────────────────────────

export const getToken = () => localStorage.getItem('token');

export const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

// ── AUTH ───────────────────────────────────────────

export const apiRegister = async (data: { name: string; email: string; password: string; role: string }) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const apiLogin = async (data: { email: string; password: string }) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const apiGetMe = async () => {
  const res = await fetch(`${BASE_URL}/auth/me`, { headers: authHeaders() });
  return res.json();
};

export const apiUpdateProfile = async (data: { name?: string; bio?: string; profileImage?: string }) => {
  const res = await fetch(`${BASE_URL}/auth/update-profile`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const apiGetMyReviews = async () => {
  const res = await fetch(`${BASE_URL}/auth/my-reviews`, { headers: authHeaders() });
  return res.json();
};

// ── RECIPES ────────────────────────────────────────

export const apiGetRecipes = async (params?: { category?: string; difficulty?: string; search?: string }) => {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  const res = await fetch(`${BASE_URL}/recipes${query ? '?' + query : ''}`);
  return res.json();
};

export const apiGetRecipe = async (id: string) => {
  const res = await fetch(`${BASE_URL}/recipes/${id}`);
  return res.json();
};

export const apiGetMyRecipes = async () => {
  const res = await fetch(`${BASE_URL}/recipes/my`, { headers: authHeaders() });
  return res.json();
};

export const apiCreateRecipe = async (data: object) => {
  const res = await fetch(`${BASE_URL}/recipes`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const apiUpdateRecipe = async (id: string, data: object) => {
  const res = await fetch(`${BASE_URL}/recipes/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const apiDeleteRecipe = async (id: string) => {
  const res = await fetch(`${BASE_URL}/recipes/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return res.json();
};

// ── REVIEWS ────────────────────────────────────────

export const apiGetReviews = async (recipeId: string) => {
  const res = await fetch(`${BASE_URL}/recipes/${recipeId}/reviews`);
  return res.json();
};

export const apiAddReview = async (recipeId: string, data: { rating: number; comment: string }) => {
  const res = await fetch(`${BASE_URL}/recipes/${recipeId}/reviews`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const apiDeleteReview = async (recipeId: string, reviewId: string) => {
  const res = await fetch(`${BASE_URL}/recipes/${recipeId}/reviews/${reviewId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return res.json();
};

// ── BOOKMARKS ──────────────────────────────────────

export const apiToggleBookmark = async (recipeId: string) => {
  const res = await fetch(`${BASE_URL}/recipes/${recipeId}/bookmark`, {
    method: 'POST',
    headers: authHeaders(),
  });
  return res.json();
};

export const apiGetMyBookmarks = async () => {
  const res = await fetch(`${BASE_URL}/recipes/bookmarks`, { headers: authHeaders() });
  return res.json();
};

// ── ADMIN ──────────────────────────────────────────

export const apiGetStats = async () => {
  const res = await fetch(`${BASE_URL}/admin/stats`, { headers: authHeaders() });
  return res.json();
};

export const apiGetAllUsers = async () => {
  const res = await fetch(`${BASE_URL}/admin/users`, { headers: authHeaders() });
  return res.json();
};

export const apiToggleUserStatus = async (id: string) => {
  const res = await fetch(`${BASE_URL}/admin/users/${id}/toggle`, {
    method: 'PUT',
    headers: authHeaders(),
  });
  return res.json();
};

export const apiDeleteUser = async (id: string) => {
  const res = await fetch(`${BASE_URL}/admin/users/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return res.json();
};

export const apiGetAllRecipes = async (status?: string) => {
  const query = status ? `?status=${status}` : '';
  const res = await fetch(`${BASE_URL}/admin/recipes${query}`, { headers: authHeaders() });
  return res.json();
};

export const apiUpdateRecipeStatus = async (id: string, status: 'approved' | 'rejected') => {
  const res = await fetch(`${BASE_URL}/admin/recipes/${id}/status`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  });
  return res.json();
};

export const apiAdminDeleteRecipe = async (id: string) => {
  const res = await fetch(`${BASE_URL}/admin/recipes/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return res.json();
};