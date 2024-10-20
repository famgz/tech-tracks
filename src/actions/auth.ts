"use server";

import { signIn, signOut } from "@/auth";

export async function login(formData: FormData) {
  const redirectTo = formData.get("redirect");
  const opts = !!redirectTo ? { redirectTo: redirectTo as string } : {};
  await signIn("google", opts);
}

export async function logout() {
  await signOut();
}
