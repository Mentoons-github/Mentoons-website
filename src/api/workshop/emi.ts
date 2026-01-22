import axios, { AxiosError } from "axios";
import { BASE_URL } from "../game/postScore";

type FetchActiveEmiArgs = {
  getToken: (options?: { template?: string }) => Promise<string | null>;
};

interface DownloadInvoiceArgs {
  getToken: GetTokenFn;
  transactionId: string;
}

type GetTokenFn = (options?: { template?: string }) => Promise<string | null>;

interface PaymentInterface {
  paymentDetails: any;
  getToken: GetTokenFn;
}

export const fetchActiveEmi = async ({ getToken }: FetchActiveEmiArgs) => {
  try {
    const token = await getToken();
    const response = await axios.get(`${BASE_URL}/workshop/active-emi`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ error: string }>;
    return error?.response?.data?.error;
  }
};

export const fetchEmiStatistics = async ({ getToken }: FetchActiveEmiArgs) => {
  try {
    const token = await getToken();
    const response = await axios.get(`${BASE_URL}/workshop/emi/statistics`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    return error?.response?.data?.message;
  }
};

export const fetchCompletedPayments = async ({
  getToken,
}: FetchActiveEmiArgs) => {
  try {
    const token = await getToken();
    const response = await axios.get(`${BASE_URL}/workshop/completed-emi`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ error: string }>;
    return error?.response?.data?.error;
  }
};

export const downloadInvoice = async ({
  getToken,
  transactionId,
}: DownloadInvoiceArgs) => {
  try {
    const token = await getToken();
    const response = await axios.get(
      `${BASE_URL}/workshop/invoice/${transactionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ error: string }>;
    return error?.response?.data?.error;
  }
};

export const handleFirstDownPayment = async ({
  paymentDetails,
  getToken,
}: PaymentInterface) => {
  try {
    const token = await getToken();
    const response = await axios.post(
      `${BASE_URL}/workshop/pay-downpayment`,
      {
        paymentDetails,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log(response.data);
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    return error?.response?.data?.message;
  }
};
