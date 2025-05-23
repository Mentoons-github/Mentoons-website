import axios from "axios";


const axiosInstance = axios.create({
  // baseURL: "https://api.mentoons.com/api/v1/",
  // baseURL: "http://localhost:4000/api/v1/",
  baseURL: import.meta.env.VITE_PROD_URL, //render bakckend
  // timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export default axiosInstance;
