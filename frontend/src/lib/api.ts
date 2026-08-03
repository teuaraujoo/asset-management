const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1`;

const apiRoutes = {
    login: `${API_BASE_URL}/auth/login`,
    logout: `${API_BASE_URL}/auth/logout`,
};

export default apiRoutes;