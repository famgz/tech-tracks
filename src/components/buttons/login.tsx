"use client";

import { login } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export default function LoginButton() {
  return (
    <form action={login}>
      <Button
        variant={"default"}
        size={"lg"}
        className="gap-1 text-xl font-bold"
        type="submit"
      >
        Login to Access
      </Button>
    </form>
  );
}
