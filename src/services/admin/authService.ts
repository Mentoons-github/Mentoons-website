import { SignInResource } from "@clerk/types";


export const signInAdmin = async (
  signIn: SignInResource,
  email: string,
  password: string
) => {
  if (!signIn) throw new Error("Clerk signIn not loaded");

  try {
    const result = await signIn.create({
      identifier: email,
      password,
    });

    return result;
  } catch (err: unknown) {
    if (err instanceof Error) {
    throw new Error(err.message);
  }
  throw new Error("Sign in failed");
  }
};
