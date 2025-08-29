import axios from "axios";

// You can set your API base URL here or use an environment variable
const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

// Attach token if available
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("accessToken");
		if (token) {
			config.headers["Authorization"] = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

export default api;
