import axios from "axios";
import { setupMockInterceptor } from "@utils/mockGameAPI";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ENDPOINT || "http://localhost:3001",
  headers: {
    "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
  },
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("naffles-auth");
  try {
    if (token) config.headers["Authorization"] = `Bearer ${JSON.parse(token)}`;
    return config;
  } catch (err) {
    console.error("Api interceptor Error: ", err);
  }
  return config;
});

// Setup mock API interceptor for demo purposes
setupMockInterceptor(instance);

export default instance;
