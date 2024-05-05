import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ENDPOINT,
  headers: {
    "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
  },
  withCredentials: true // Ensure cookies are sent with requests
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
export default instance;
