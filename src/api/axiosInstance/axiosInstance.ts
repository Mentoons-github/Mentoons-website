import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const attachAuthInterceptor = (
  getToken: () => Promise<string | null>,
  signOut: () => Promise<void>
) => {
  api.interceptors.request.clear();
  api.interceptors.response.clear();

  api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (res) => res,
    async (error) => {
      if (
        error.response &&
        error.response.status === 403 &&
        error.response.data.reason === "BLOCKED_USER"
      ) {
        try {
          await signOut();
        } catch (err) {
          console.error("Sign out failed:", err);
        } finally {
          window.location.href = "/adda/blocked";
        }
      }
      return Promise.reject(error);
    }
  );
};

export { api };
export default attachAuthInterceptor;
