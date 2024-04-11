import axios from "axios";

export default axios.create({
  baseURL: process.env.NEXT_PUBLIC_ENDPOINT,
  headers: {
    "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
  },
});
