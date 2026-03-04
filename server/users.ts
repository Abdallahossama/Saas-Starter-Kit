"use server";

import { auth } from "@/lib/auth";

export const signInUser = async (email: string, password: string) => {
  try {
      await auth.api.signInEmail({
          body: {
              email,
              password
          },
      });

      return { success: true, message: "Signed in successfully" };
  } catch (error) {
      const e = error as Error;
      return { success: false, message: e.message || "Failed to sign in" };
  }
};

export const createUser = async (email: string, password: string) => {
  try {
    const user = await auth.api.signUpEmail({
      body: {
        name: "John Doe",
        email,
        password,
      },
    });
    return { success: true, user };
  } catch (error) {
    console.error(error);
    return { success: false, error: error as string };
  }
};




