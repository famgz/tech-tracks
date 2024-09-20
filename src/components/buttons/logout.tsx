"use client";

import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";

export default function LogoutButton() {
  return (
    <form action={logout}>
      <Button
        variant={"ghost"}
        size={"icon"}
        className="w-full justify-between gap-3 px-3"
        type="submit"
      >
        Sair
        <LogOutIcon size={18} />
      </Button>
    </form>
  );
}
