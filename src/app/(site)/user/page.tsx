import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function UserPage() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return <h1>Username</h1>;
}
