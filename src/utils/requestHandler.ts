import { AxiosError } from "axios";

export const requestHandler = async <T>(
  request: () => Promise<{ data: T }>,
  onError?: (message: string) => void
): Promise<T | null> => {
  try {
    const response = await request();
    return response.data;
  } catch (error: unknown) {
    console.error(error);
    const err = error as AxiosError<{ message: string }>;
    const message = err?.response?.data?.message || "Something went wrong";

    if (onError) onError(message);
    return null;
  }
};
