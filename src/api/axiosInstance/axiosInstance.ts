import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_PROD_URL,
});

const attachAuthInterceptor = (
  getToken: () => Promise<string | null>,
  signOut: () => Promise<void>
) => {
  api.interceptors.request.use(async (config) => {
    let token = await getToken();

    if (!token) {
      token = await new Promise((resolve) =>
        setTimeout(async () => resolve(await getToken()), 200)
      );
    }
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
