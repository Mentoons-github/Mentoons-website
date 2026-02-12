import axios, { AxiosError } from "axios";
import { BASE_URL } from "../game/postScore";
import { FormValue } from "@/pages/v2/feedback/feedback";

interface Submission {
  formValues: FormValue;
  getToken: () => Promise<string | null>;
}

export const feedbackSubmissions = async ({
  formValues,
  getToken,
}: Submission) => {
  try {
    const token = await getToken();
    const response = await axios.post(
      `${BASE_URL}/user-feedback`,
      {
        formValues,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (err: unknown) {
    const error = err as AxiosError<{ error: string }>;
    console.error(err);
    return {
      success: false,
      message: error?.response?.data?.error,
    };
  }
};

export const fetchFeedback = async (limit: number = 10, page: number = 1) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/user-feedback?limit=${limit}&page=${page}`,
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (err: unknown) {
    console.error(err);
    const error = err as AxiosError<{ error: string }>;
    return {
      success: false,
      message: error?.response?.data?.error,
    };
  }
};

export const saveDisplayReviews = async ({
  reviewIds,
  getToken,
}: {
  reviewIds: string[];
  getToken: () => Promise<string | null>;
}) => {
  try {
    const token = await getToken();
    const response = await axios.patch(
      `${BASE_URL}/user-feedback/display`,
      {
        reviewIds,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (err: unknown) {
    console.error(err);
    const error = err as AxiosError<{ error: string }>;
    return {
      success: false,
      message: error?.response?.data?.error,
    };
  }
};
