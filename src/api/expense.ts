import { api } from "./axiosInstance/axiosInstance";

const BASE_URL = import.meta.env.VITE_PROD_URL;

interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  error?: string;
}

export type ExpenseCategory =
  | "daily"
  | "salary"
  | "freelancer"
  | "incentive"
  | "infrastructure"
  | "miscellaneous";

export type ExpenseType = "internal" | "external";

export type PaymentMode =
  "cash" | "upi" | "bank_transfer" | "card" | "cheque" | "other";

export type PaymentStatus = "paid" | "pending";

export interface ExpensePayload {
  category: ExpenseCategory;
  expenseType: ExpenseType;
  title: string;
  description?: string;
  amount: number;
  date: string; // "YYYY-MM-DD"
  paymentMode: PaymentMode;
  transactionRef?: string;
  status?: PaymentStatus;
  employee?: string; // salary / freelancer / incentive
  salaryMonth?: number; // salary only
  salaryYear?: number; // salary only
  vendorName?: string;
  billNumber?: string;
}

export interface ExpenseRecord {
  _id: string;
  category: ExpenseCategory;
  expenseType: ExpenseType;
  title: string;
  description: string;
  amount: number;
  date: string;
  paymentMode: PaymentMode;
  transactionRef: string;
  status: PaymentStatus;
  vendorName: string;
  billNumber: string;
  salaryMonth?: number;
  salaryYear?: number;
  employee?: {
    _id: string;
    department?: string;
    jobRole?: string;
    salary?: number;
    employmentType?: string;
    user?: { name?: string; email?: string };
  } | null;
  createdAt?: string;
}

export interface AllExpensesData {
  total: number;
  currentPage: number;
  totalPages: number;
  expenses: ExpenseRecord[];
}

export interface ExpenseParams {
  category?: ExpenseCategory | "";
  expenseType?: ExpenseType | "";
  paymentMode?: PaymentMode | "";
  status?: PaymentStatus | "";
  employeeId?: string;
  from?: string;
  to?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface SummaryRow<T = string> {
  _id: T;
  total: number;
  count: number;
}

export interface ExpenseSummaryData {
  grandTotal: number;
  count: number;
  byCategory: SummaryRow<ExpenseCategory>[];
  byType: SummaryRow<ExpenseType>[];
  byMode: SummaryRow<PaymentMode>[];
  byStatus: SummaryRow<PaymentStatus>[];
}

export interface Payee {
  _id: string;
  name: string;
  email: string;
  department: string;
  jobRole: string;
  employmentType: string;
  salary: number;
  active: boolean;
}

// verifyRole reads "Bearer <token>" from the Authorization header
const authHeaders = (token?: string | null) => ({
  headers: { Authorization: `Bearer ${token ? token : ""}` },
});

const getErrorMessage = (error: any, fallback: string): string =>
  error.response?.data?.error || error.response?.data?.message || fallback;

// drop empty filters so they are not sent as ?category=
const cleanParams = (params: Record<string, any>) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== "" && v !== undefined && v !== null,
    ),
  );

export const fetchExpenses = async (
  params: ExpenseParams = {},
  token?: string | null,
): Promise<ApiResponse<AllExpensesData>> => {
  try {
    const response = await api.get(`${BASE_URL}/expenses`, {
      params: cleanParams(params),
      ...authHeaders(token),
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("API Error:", error);
    return {
      success: false,
      data: null,
      error: getErrorMessage(error, "Failed to fetch expenses"),
    };
  }
};

export const fetchExpenseSummary = async (
  params: ExpenseParams = {},
  token?: string | null,
): Promise<ApiResponse<ExpenseSummaryData>> => {
  try {
    const response = await api.get(`${BASE_URL}/expenses/summary`, {
      params: cleanParams(params),
      ...authHeaders(token),
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("API Error:", error);
    return {
      success: false,
      data: null,
      error: getErrorMessage(error, "Failed to fetch expense summary"),
    };
  }
};

export const fetchPayees = async (
  group: "staff" | "freelancer" | "all",
  token?: string | null,
): Promise<ApiResponse<{ employees: Payee[] }>> => {
  try {
    const response = await api.get(`${BASE_URL}/expenses/payees`, {
      params: { group },
      ...authHeaders(token),
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("API Error:", error);
    return {
      success: false,
      data: null,
      error: getErrorMessage(error, "Failed to fetch employees"),
    };
  }
};

export const createExpense = async (
  payload: ExpensePayload,
  token?: string | null,
): Promise<ApiResponse<{ message: string; expense: ExpenseRecord }>> => {
  try {
    const response = await api.post(
      `${BASE_URL}/expenses`,
      payload,
      authHeaders(token),
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Create expense failed:", error);
    return {
      success: false,
      data: null,
      error: getErrorMessage(error, "Failed to add the expense"),
    };
  }
};

export const updateExpense = async (
  id: string,
  payload: ExpensePayload,
  token?: string | null,
): Promise<ApiResponse<{ message: string; expense: ExpenseRecord }>> => {
  try {
    const response = await api.put(
      `${BASE_URL}/expenses/${id}`,
      payload,
      authHeaders(token),
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Update expense failed:", error);
    return {
      success: false,
      data: null,
      error: getErrorMessage(error, "Failed to update the expense"),
    };
  }
};

export const deleteExpense = async (
  id: string,
  token?: string | null,
): Promise<ApiResponse<{ message: string }>> => {
  try {
    const response = await api.delete(
      `${BASE_URL}/expenses/${id}`,
      authHeaders(token),
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Delete expense failed:", error);
    return {
      success: false,
      data: null,
      error: getErrorMessage(error, "Failed to delete the expense"),
    };
  }
};
