import axios, { AxiosError } from "axios";
import { BASE_URL } from "../game/postScore";
import { Incentive } from "@/pages/employee/incentive/incentive";

interface FetchEmployeeIncentiveParams {
  getToken: () => Promise<string | null>;
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
}

interface ApiResponse {
  success: boolean;
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  data?: Incentive[];
  message?: string;
}

export const fetchEmployeeIncentive = async ({
  getToken,
  page = 1,
  limit = 6,
  search = "",
  sort = "",
}: FetchEmployeeIncentiveParams): Promise<ApiResponse> => {
  try {
    const token = await getToken();
    if (!token) {
      return { success: false, message: "Authentication token not available" };
    }

    const params: Record<string, string | number> = {
      page: page.toString(),
      limit: limit.toString(),
    };

    if (search.trim()) {
      params.search = search.trim();
    }

    if (sort.trim()) {
      params.sort = sort.trim();
    }

    const response = await axios.get(`${BASE_URL}/employee/incentive`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      ...response.data,
    };
  } catch (err: unknown) {
    console.error("fetchEmployeeIncentive error:", err);

    const error = err as AxiosError<{ error?: string; message?: string }>;

    if (error.response) {
      return {
        success: false,
        message:
          error.response.data.error ||
          error.response.data.message ||
          `Server error (${error.response.status})`,
      };
    }

    if (error.request) {
      return {
        success: false,
        message: "No response from server – check network or backend",
      };
    }

    return {
      success: false,
      message: error.message || "Unexpected error",
    };
  }
};
