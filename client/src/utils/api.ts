import axios from "axios";

const api = axios.create({
	baseURL: "http://localhost:3001/auth",
	withCredentials: true,
});

export default api;
