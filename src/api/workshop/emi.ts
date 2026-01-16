import axios, { AxiosError } from "axios";
import { BASE_URL } from "../game/postScore";

type FetchActiveEmiArgs = {
  getToken: (options?: { template?: string }) => Promise<string | null>;
};

type GetTokenFn = (options?: { template?: string }) => Promise<string | null>;

interface PaymentInterface {
  paymentDetails: any;
  getToken: GetTokenFn;
}

export const fetchActiveEmi = async ({ getToken }: FetchActiveEmiArgs) => {
  try {
    const token = await getToken();
    console.log(token);
    const response = await axios.get(`${BASE_URL}/workshop/active-emi`, {
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

export const handleFirstDownPayment = async ({
  paymentDetails,
  getToken,
}: PaymentInterface) => {
  try {
    console.log("calling the emi fucntion");
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
      }
    );
    console.log(response.data);
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    return error?.response?.data?.message;
  }
};
