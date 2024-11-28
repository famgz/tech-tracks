"use server";

import { auth, signIn, signOut } from "@/auth";
import { LoginProvider, SessionUser } from "@/types/auth";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const redirectTo = formData.get("redirect");
  const loginProvider = formData.get("login-provider") as LoginProvider;
  const opts = { redirectTo: (redirectTo || "/user") as string };
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

export async function getSessionUserIdElseThrow(): Promise<string> {
  const session = await auth();
  const userId = session?.user.id;
  if (!userId) {
    throw new Error("Not authenticated");
  }
  return userId;
}
