import axios from "axios";

const BASE_URL = import.meta.env.VITE_PROD_URL;

interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
}

export const fetchMeetups = async (
  search: string = ""
): Promise<ApiResponse> => {
  try {
    const response = await axios.get(`${BASE_URL}/meetup?search=${search}`);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: any) {
    console.error("API Error:", error);
    return {
      success: false,
      data: error.message,
    };
  }
};

export const meetupDelete = async (id: string) => {
  try {
    const response = await axios.delete(`${BASE_URL}/meetup/${id}`);
    if (response.status === 200) {
      return {
        success: true,
        data: response.data,
      };
    }
  } catch (error: any) {
    console.error("Delete failed:", error);
    return {
      success: false,
      data: error.message,
    };
  }
};
