"use server";

import { auth, signIn, signOut } from "@/auth";
import { LoginProvider, SessionUser } from "@/types/auth";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const redirectTo = formData.get("redirect");
  const loginProvider = formData.get("login-provider") as LoginProvider;
  const opts = !!redirectTo ? { redirectTo: redirectTo as string } : {};
  await signIn(loginProvider, opts);
}

export async function logout() {
  await signOut();
}

export async function getSessionUserElseRedirectToLogin(): Promise<SessionUser> {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    return redirect("/login");
  }
  return user;
}
