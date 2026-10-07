import axiosInstance from "../axios";

export const getUserDetails = async () => {
  return axiosInstance.get(`/user/user/`);
};
