import axios, { AxiosError } from "axios";
import { BASE_URL } from "../game/postScore";
import { Badge } from "@/types/adda/userProfile";

export const fetchBadges = async ({ token }: { token: string }) => {
  try {
    const response = await axios.get(`${BASE_URL}/badge/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      data: response.data,
      success: true,
    };
  } catch (error: any) {
    const err = error as AxiosError<{ error: string }>;
    return {
      error: err.response?.data.error,
      success: false,
    };
  }
};

export const deleteBadge = async ({
  token,
  badgeId,
}: {
  token: string;
  badgeId: string;
}) => {
  try {
    const response = await axios.delete(`${BASE_URL}/badge/${badgeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response.data);

    return {
      data: response.data,
      success: true,
    };
  } catch (error: any) {
    const err = error as AxiosError<{ error: string }>;
    return {
      error: err.response?.data.error,
      success: false,
    };
  }
};

export const createBadge = async ({
  data,
  token,
}: {
  data: Badge;
  token: string;
}) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/badge/add`,
      { data },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return {
      success: true,
      message: response.data.message || "Badge created successfully",
      data: response.data,
    };
  } catch (error: any) {
    const err = error as AxiosError<{ message?: any }>;

    let errorMsg = "Failed to create badge";

    if (err.response?.data?.message) {
      const msg = err.response.data.message;
      errorMsg = typeof msg === "object" ? Object.values(msg).join(", ") : msg;
    }

    return {
      success: false,
      error: errorMsg,
    };
  }
};
