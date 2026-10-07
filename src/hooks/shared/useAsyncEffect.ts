import { getErrorMessage } from "@/utils/getErrorMessage";
import { errorToast } from "@/utils/toastResposnse";
import { useEffect } from "react";

interface UseAsyncEffectOptions {
  errorMessage?: string | ((err: unknown) => string);
  showToast?: boolean;
}

export const useAsyncEffect = (
  effect: () => Promise<void>,
  deps: React.DependencyList,
  options: UseAsyncEffectOptions = {},
) => {
  const { errorMessage = "Something went wrong", showToast = true } = options;

  useEffect(() => {
    (async () => {
      try {
        await effect();
      } catch (err) {
        console.error(err);
        if (showToast) {
          errorToast(getErrorMessage(err, errorMessage));
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export default useAsyncEffect;
