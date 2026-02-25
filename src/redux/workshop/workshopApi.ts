import { BplVerificationTypes } from "@/types/workshopsV2/bplVerificationTypes";
import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_PROD_URL}/workshop`;

export const getInvoiceDetailsApi = async (
  transactionId: string,
  token: string,
) => {
  return await axios.get(`${BASE_URL}/invoice/${transactionId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

//bpl verification form submittion
export const submitBplVerificationFormApi = async (
  details: BplVerificationTypes,
  token: string,
) => {
  return await axios.post(`${BASE_URL}/bpl-verification`, details, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

//check applied or not
export const checkAppliedOrNotApi = async (token: string) => {
  return await axios.get(`${BASE_URL}/bpl-verification/check-applied`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

//get all bpl applications
export const getAllBplApplicationApi = async (
  token: string,
  limit: number,
  page: number,
  search: string,
  sortOrder: string,
  sortField: string,
  filter: string,
) => {
  return await axios.get(`${BASE_URL}/bpl-verification/getAll`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      limit,
      page,
      search,
      sortOrder,
      sortField,
      filter,
    },
  });
};

// update application status
export const updateApplicationStatusApi = async (
  token: string,
  data: { applicationId: string; status: string },
) => {
  return await axios.put(`${BASE_URL}/bpl-verification/update-status`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

//delete application
export const deleteBplApplicationApi = async (
  token: string,
  applicationId: string,
) => {
  return await axios.delete(
    `${BASE_URL}/bpl-verification/delete/${applicationId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};
