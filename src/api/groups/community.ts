import { BASE_URL } from "../game/postScore";
import axios, { AxiosError } from "axios";
import { FormData } from "@/pages/v2/community/community";

interface CreateCommunity {
  data: FormData;
  token: string;
}

export const fetchCommunities = async (
  searchTerm: string = "",
  token?: string,
) => {
  try {
    const url = searchTerm
      ? `${BASE_URL}/groups?search=${encodeURIComponent(searchTerm)}`
      : `${BASE_URL}/groups`;

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
      `${BASE_URL}/groups/${id}/approve`,
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
      `${BASE_URL}/groups/${id}/reject`,
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

    const response = await axios.delete(`${BASE_URL}/groups/${id}`, config);
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

export const createCommunity = async ({ data, token }: CreateCommunity) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/groups/create`,
      {
        data,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return {
      data: response.data,
      success: true,
    };
  } catch (error: any) {
    console.error(error);
    const err = error as AxiosError<{ error: string }>;
    return {
      error: err,
      success: false,
    };
  }
};

export const getCommunityById = async ({
  id,
  token,
}: {
  id: string;
  token: string;
}) => {
  try {
    const response = await axios.get(`${BASE_URL}/groups/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      data: response.data,
      success: true,
    };
  } catch (error: any) {
    console.error(error);
    const err = error as AxiosError<{ error: string }>;
    return {
      error: err,
      success: false,
    };
  }
};

export const editCommunity = async ({
  data,
  token,
  id,
}: {
  data: Partial<FormData>;
  token: string;
  id: string;
}) => {
  try {
    const response = await axios.post(`${BASE_URL}/groups/edit/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      data: response.data,
      success: true,
    };
  } catch (error: any) {
    console.error(error);
    const err = error as AxiosError<{ error: string }>;
    return {
      error: err,
      success: false,
    };
  }
};
