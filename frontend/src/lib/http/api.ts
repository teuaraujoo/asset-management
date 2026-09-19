const rawBaseUrl = (import.meta.env.VITE_API_URL ?? "http://localhost:3000/").replace(/\/$/, "");
const API_BASE_URL = `${rawBaseUrl}/api/v1`;

const apiRoutes = {
    login: `${API_BASE_URL}/auth/login`,
    logout: `${API_BASE_URL}/auth/logout`,
    me: `${API_BASE_URL}/auth/me`,
    projects: `${API_BASE_URL}/projects`,
    files: `${API_BASE_URL}/files`,
    users: `${API_BASE_URL}/users`,
};

export default apiRoutes;
