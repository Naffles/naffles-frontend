import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ENDPOINT,
  headers: {
    "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
  },
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("naffles-auth");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});
export default instance;
