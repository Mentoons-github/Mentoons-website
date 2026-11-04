import { api } from "./axiosInstance/axiosInstance";

const BASE_URL = import.meta.env.VITE_PROD_URL;

interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  error?: string;
}

type YesNo = "YES" | "NO" | "";

export interface DailyReportPayload {
  date: string; // "YYYY-MM-DD"
  task: string;
  notes: string;
  tools: string;
  complete: YesNo;
  reason: string;
  plan: string;
  didAsDiscussed: YesNo;
}

// What the server sends back (signature fields are set by the admin only)
export interface DailyReportRecord extends DailyReportPayload {
  _id?: string;
  employeeId?: string;
  employeeName?: string | null;
  late?: boolean;
  submittedAt?: string;
  signature?: string | null;
  signedBy?: string | null;
  signedByName?: string | null;
  signedAt?: string | null;
}

export interface MyReportsData {
  employeeId: string;
  employeeName: string | null;
  reports: DailyReportRecord[];
}

export interface AllReportsData {
  totalReports: number;
  currentPage: number;
  totalPages: number;
  reports: DailyReportRecord[];
}

export interface AllReportsParams {
  from?: string;
  to?: string;
  employeeId?: string;
  signed?: "true" | "false";
  page?: number;
  limit?: number;
}

// verifyRole reads "Bearer <token>" from the Authorization header
const authHeaders = (token?: string | null) => ({
  headers: { Authorization: `Bearer ${token ? token : ""}` },
});

const getErrorMessage = (error: any, fallback: string): string =>
  error.response?.data?.error || error.response?.data?.message || fallback;

/* ---------------- Employee ---------------- */

export interface DailyReportRow {
  employeeId: string;
  name: string;
  jobRole: string;
  department: string;
  status: "signed" | "submitted" | "missing";
  report: DailyReportRecord | null;
}

export interface ReportsByDateData {
  date: string;
  isOffDay: boolean;
  employees: DailyReportRow[];
}

export const fetchReportsByDate = async (
  date: string,
  token?: string | null,
): Promise<ApiResponse<ReportsByDateData>> => {
  try {
    const response = await api.get(`${BASE_URL}/daily-report/by-date`, {
      params: { date },
      ...authHeaders(token),
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error("API Error:", error);
    return {
      success: false,
      data: null,
      error: getErrorMessage(error, "Failed to fetch reports"),
    };
  }
};

export const fetchMyReports = async (
  from: string,
  to: string,
  token?: string | null,
): Promise<ApiResponse<MyReportsData>> => {
  try {
    const response = await api.get(
      `${BASE_URL}/daily-report/my-reports?from=${from}&to=${to}`,
      authHeaders(token),
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error("API Error:", error);
    return {
      success: false,
      data: null,
      error: getErrorMessage(error, "Failed to fetch daily reports"),
    };
  }
};

export const submitDailyReport = async (
  payload: DailyReportPayload,
  token?: string | null,
): Promise<ApiResponse<{ message: string; report: DailyReportRecord }>> => {
  try {
    const response = await api.post(
      `${BASE_URL}/daily-report`,
      payload,
      authHeaders(token),
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error("Submit failed:", error);
    return {
      success: false,
      data: null,
      error: getErrorMessage(error, "Failed to save the report"),
    };
  }
};

/* ---------------- Admin ---------------- */

export const fetchAllReports = async (
  params: AllReportsParams = {},
  token?: string | null,
): Promise<ApiResponse<AllReportsData>> => {
  try {
    const response = await api.get(`${BASE_URL}/daily-report`, {
      params,
      ...authHeaders(token),
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error("API Error:", error);
    return {
      success: false,
      data: null,
      error: getErrorMessage(error, "Failed to fetch reports"),
    };
  }
};

// Either send the image itself, or ask the server to use the saved signature
export type SignPayload = { signature: string } | { useSaved: true };

export const signDailyReport = async (
  id: string,
  payload: SignPayload,
  token?: string | null,
): Promise<ApiResponse<{ message: string; report: DailyReportRecord }>> => {
  try {
    const response = await api.patch(
      `${BASE_URL}/daily-report/${id}/sign`,
      payload,
      authHeaders(token),
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error("Sign failed:", error);
    return {
      success: false,
      data: null,
      error: getErrorMessage(error, "Failed to sign the report"),
    };
  }
};

/* ---------------- Admin saved signature ---------------- */

export interface MySignatureData {
  signature: string | null;
}

export const fetchMySignature = async (
  token?: string | null,
): Promise<ApiResponse<MySignatureData>> => {
  try {
    const response = await api.get(
      `${BASE_URL}/daily-report/signature/me`,
      authHeaders(token),
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error("Fetch signature failed:", error);
    return {
      success: false,
      data: null,
      error: getErrorMessage(error, "Failed to load saved signature"),
    };
  }
};

export const saveMySignature = async (
  signature: string,
  token?: string | null,
): Promise<ApiResponse<{ message: string; signature: string }>> => {
  try {
    const response = await api.put(
      `${BASE_URL}/daily-report/signature/me`,
      { signature },
      authHeaders(token),
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error("Save signature failed:", error);
    return {
      success: false,
      data: null,
      error: getErrorMessage(error, "Could not save signature"),
    };
  }
};

export const deleteMySignature = async (
  token?: string | null,
): Promise<ApiResponse<{ message: string }>> => {
  try {
    const response = await api.delete(
      `${BASE_URL}/daily-report/signature/me`,
      authHeaders(token),
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error("Delete signature failed:", error);
    return {
      success: false,
      data: null,
      error: getErrorMessage(error, "Could not remove saved signature"),
    };
  }
};
