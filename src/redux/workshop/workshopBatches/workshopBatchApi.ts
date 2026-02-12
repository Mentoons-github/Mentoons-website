import { SessionScoringType } from "@/types/workshopsV2/workshopBatchTypes";
import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_PROD_URL}/workshop-batch`;

export const getAllWorkshopBatchesApi = async (
  token: string,
  search: string,
  sort: string,
  filter: string,
  page: number,
  limit: number,
) => {
  return await axios.get(`${BASE_URL}/all-batches`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      search,
      sort,
      filter,
      page,
      limit,
    },
  });
};

export const getSingleWorkshopBatchApi = async (
  token: string,
  workshopBatchId: string,
) => {
  return await axios.get(`${BASE_URL}/single-batch/${workshopBatchId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const assignWorkshopBatchApi = async (
  token: string,
  data: { workshopBatchId: string; psychologistId: string; startDate: string },
) => {
  return await axios.put(`${BASE_URL}/assign-batch`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getPsychologistWorkshopBatchesApi = async (
  token: string,
  search: string,
  sort: string,
  filter: string,
  page: number,
  limit: number,
) => {
  return await axios.get(`${BASE_URL}/psychologist/batches`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      search,
      sort,
      filter,
      page,
      limit,
    },
  });
};

export const addScoringWorkshopApi = async (
  token: string,
  studentId: string,
  sessionScore: SessionScoringType,
) => {
  return await axios.put(`${BASE_URL}/scoring/${studentId}`, sessionScore, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateScoringWorkshopApi = async (
  token: string,
  studentId: string,
  sessionId: string,
  sessionScore: SessionScoringType,
) => {
  return await axios.put(
    `${BASE_URL}/scoring/edit/${studentId}/${sessionId}`,
    sessionScore,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};
