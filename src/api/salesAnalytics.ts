import { api } from "./axiosInstance/axiosInstance";

const BASE_URL = import.meta.env.VITE_PROD_URL;

interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  error?: string;
}

export interface SalesCategory {
  key: string;
  label: string;
  color: string;
  unitLabel: string;
  revenue: number;
  units: number;
  share: number;
  growth: number | null; // null = no sales in the previous period
}

export interface SalesProduct {
  name: string;
  category: string;
  price: number;
  units: number;
  revenue: number;
}

export interface SalesLocation {
  city: string;
  state: string;
  revenue: number;
  orders: number;
  customers: number;
  perCat: Record<string, number>;
}

export type SalesTrendRow = { period: string } & Record<
  string,
  number | string
>;

export interface SalesSummary {
  totalRevenue: number;
  totalOrders: number;
  totalUnits: number;
  uniqueCustomers: number;
}

export interface SalesAnalyticsData {
  periodLabel: string;
  days: number;
  from: string;
  to: string;
  summary: SalesSummary;
  categories: SalesCategory[];
  products: SalesProduct[];
  locations: SalesLocation[];
  trend: SalesTrendRow[];
}

// verifyToken reads "Bearer <token>" from the Authorization header
const authHeaders = (token?: string | null) => ({
  headers: { Authorization: `Bearer ${token ? token : ""}` },
});

const getErrorMessage = (error: any, fallback: string): string =>
  error.response?.data?.error || error.response?.data?.message || fallback;

export const fetchSalesAnalytics = async (
  days: number,
  token?: string | null,
): Promise<ApiResponse<SalesAnalyticsData>> => {
  try {
    const response = await api.get(`${BASE_URL}/sales-analytics`, {
      params: { days },
      ...authHeaders(token),
    });
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: any) {
    console.error("API Error:", error);
    return {
      success: false,
      data: null,
      error: getErrorMessage(error, "Failed to fetch sales analytics"),
    };
  }
};
