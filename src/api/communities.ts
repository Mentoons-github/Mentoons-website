import { BASE_URL } from "./game/postScore";
import axios from "axios";
import { AxiosError } from "axios";

export const fetchCommunities = async (
  searchTerm: string = "",
  token?: string,
) => {
  try {
    const url = searchTerm
      ? `${BASE_URL}/groups?search=${encodeURIComponent(searchTerm)}`
      : `${BASE_URL}/communities`;

    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};

    const response = await axios.get(url, config);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch communities",
      );
    }
    throw error;
  }
};

export const approveCommunity = async (id: string, token?: string) => {
  try {
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};

    const response = await axios.put(
      `${BASE_URL}/communities/${id}/approve`,
      {},
      config,
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to approve community",
      );
    }
    throw error;
  }
};

export const rejectCommunity = async (id: string, token?: string) => {
  try {
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};

    const response = await axios.put(
      `${BASE_URL}/communities/${id}/reject`,
      {},
      config,
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to reject community",
      );
    }
    throw error;
  }
};

export const deleteCommunity = async (id: string, token?: string) => {
  try {
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};

    const response = await axios.delete(
      `${BASE_URL}/communities/${id}`,
      config,
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to delete community",
      );
    }
    throw error;
  }
};
