import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_PROD_URL}/workshop`;

export const getInvoiceDetailsApi = async (
  transactionId: string,
  token: string
) => {
  return await axios.get(`${BASE_URL}/invoice/${transactionId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


