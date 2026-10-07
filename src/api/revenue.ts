import { api } from "./axiosInstance/axiosInstance";

export interface RevenueCategory {
  orderType: string;
  label: string;
  revenue: number;
  orders: number;
}

export interface RevenueMonth {
  month: string; // "2026-07"
  total: number;
  [orderType: string]: number | string;
}

export interface RevenueSummary {
  totalRevenue: number;
  totalOrders: number;
  byCategory: RevenueCategory[];
  monthlyTrend: RevenueMonth[];
}

export interface RevenueSummaryParams {
  startDate?: string;
  endDate?: string;
}

export const getRevenueSummary = async (
  params?: RevenueSummaryParams,
): Promise<RevenueSummary> => {
  const { data } = await api.get("/revenue/summary", { params });
  return data.data;
};

// ---- Orders by category ----

export interface RevenueOrder {
  id: string;
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  picture: string | null;
  amount: number;
  status: string;
  productInfo: string;
  paymentMethod: string;
  itemCount: number;
  createdAt: string;
}

export interface RevenueOrdersPagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export interface RevenueOrdersResponse {
  orderType: string;
  label: string;
  orders: RevenueOrder[];
  pagination: RevenueOrdersPagination;
}

export interface RevenueOrdersParams {
  orderType: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export const getRevenueOrdersByCategory = async (
  params: RevenueOrdersParams,
): Promise<RevenueOrdersResponse> => {
  const { data } = await api.get("/revenue/orders", { params });
  return data.data;
};
