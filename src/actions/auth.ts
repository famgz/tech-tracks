"use server";

import { signIn, signOut } from "@/auth";
import { LoginProvider } from "@/types/auth";

export async function login(formData: FormData) {
  const redirectTo = formData.get("redirect");
  const loginProvider = formData.get('login-provider') as LoginProvider
  const opts = !!redirectTo ? { redirectTo: redirectTo as string } : {};
  await signIn(loginProvider, opts);
}

export async function logout() {
  await signOut();
}
