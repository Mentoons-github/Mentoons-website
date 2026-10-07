import { getErrorMessage } from "@/utils/getErrorMessage";
import { errorToast, successToast } from "@/utils/toastResposnse";
import { useCallback, useState } from "react";

interface UseAsyncActionOptions {
  errorMessage?: string | ((err: unknown) => string);
  successMessage?: string;
  showToast?: boolean;
  onSuccess?: () => void;
  onError?: (err: unknown) => void;
}


export const useAsyncAction = <Args extends unknown[]>(
  action: (...args: Args) => Promise<void>,
  options: UseAsyncActionOptions = {},
) => {
  const {
    errorMessage = "Something went wrong",
    successMessage,
    showToast = true,
    onSuccess,
    onError,
  } = options;

  const [loading, setLoading] = useState(false);

  const run = useCallback(
    async (...args: Args) => {
      setLoading(true);
      try {
        await action(...args);
        if (showToast && successMessage) {
          successToast(successMessage);
        }
        onSuccess?.();
      } catch (err) {
        console.error(err);
        if (showToast) {
          errorToast(getErrorMessage(err, errorMessage));
        }
        onError?.(err);
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [action],
  );

  return { run, loading };
};

export default useAsyncAction;
