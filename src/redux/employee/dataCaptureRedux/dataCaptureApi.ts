import {
  Details,
  ReviewMechanismFormValues,
  ScoringSubmission,
} from "@/types/employee/dataCaptureTypes";
import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_PROD_URL}/data-capture`;

//create new dataCapture
export const creatDataCaptureApi = async (data: Details, token: string) => {
  return await axios.post(`${BASE_URL}/create`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

//edit new dataCapture
export const editDataCaptureApi = async (
  data: Details,
  token: string,
  dataCaptureId: string,
) => {
  return await axios.put(`${BASE_URL}/edit/${dataCaptureId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

//fetch data capture
export const fetchDataCaptureApi = async (
  token: string,
  sortBy: string,
  page: number,
  limit: number,
  search: string,
  order: string,
) => {
  return await axios.get(
    `${BASE_URL}/fetch?sortBy=${sortBy}&page=${page}&limit=${limit}&search=${search}&order=${order}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

//fetch single data capture
export const fetchSingleDataCaptureApi = async (
  token: string,
  dataCaptureId: string,
) => {
  return await axios.get(`${BASE_URL}/fetch-single/${dataCaptureId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// add dataCapture review
export const addDataCaptureReviewApi = async (
  token: string,
  dataCaptureId: string,
  reviewMechanism: ReviewMechanismFormValues,
) => {
  return await axios.put(
    `${BASE_URL}/add-review/${dataCaptureId}`,
    reviewMechanism,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

// add dataCapture review
export const addDataCaptureScoreApi = async (
  token: string,
  dataCaptureId: string,
  scoringData: ScoringSubmission,
) => {
  return await axios.put(
    `${BASE_URL}/add-score/${dataCaptureId}`,
    scoringData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};
