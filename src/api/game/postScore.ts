import axios, { AxiosError } from "axios";

export const BASE_URL = import.meta.env.VITE_PROD_URL;

interface PostScoreBody {
  gameId: string;
  difficulty: string;
  score: number;
  success: boolean;
}

interface PostScore {
  body: PostScoreBody;
  token: string;
}

const postScore = async ({ body, token }: PostScore) => {
  try {
    const response = await axios.post(`${BASE_URL}/game/score`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message: string }>;
    return err?.response?.data?.message ?? "Error updating the score";
  }
};

export default postScore;
