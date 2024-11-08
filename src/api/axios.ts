import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://mentoons-backend-zlx3.onrender.com/api/v1/",
  // baseURL: "http://localhost:4000/api/v1/",
  // timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response.status === 401) {
//       // Handle unauthorized access (e.g., redirect to login)
//       console.log('unauthorized')
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
