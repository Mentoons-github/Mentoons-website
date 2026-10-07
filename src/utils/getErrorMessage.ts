export const getErrorMessage = (
  err: unknown,
  fallback: string | ((err: unknown) => string),
): string => {
  if (typeof fallback === "function") {
    return fallback(err);
  }
  if (err instanceof Error) {
    return err.message;
  }
  return fallback;
};
