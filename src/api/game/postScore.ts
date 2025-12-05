import axios, { AxiosError } from "axios";

const BASE_URL = `${import.meta.env.VITE_PROD_URL}/game/score`;

interface PostScoreBody {
  gameId: string;
  difficulty: string;
  score: number;
}

interface PostScore {
  body: PostScoreBody;
  token: string;
}

const postScore = async ({ body, token }: PostScore) => {
  try {
    const response = await axios.post(`${BASE_URL}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response);
  } catch (error: unknown) {
    const err = error as AxiosError<{ message: string }>;
    return err?.response?.data?.message ?? "Error updating the score";
  }
};

export default postScore;
