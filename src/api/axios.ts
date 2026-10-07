import axios, { InternalAxiosRequestConfig } from "axios";

let getTokenFn: (() => Promise<string | null | undefined>) | null = null;

export const setGetToken = (fn: () => Promise<string | null | undefined>) => {
  getTokenFn = fn;
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_PROD_URL,
});

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await getTokenFn?.();
      console.log("token :", token);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error retrieving token", error);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosInstance;
