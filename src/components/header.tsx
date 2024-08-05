import { ModeToggle } from "@/components/buttons/mode-toggle";
import { Button } from "@/components/ui/button";
import { UserIcon } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="_container">
      <div className="flex items-center justify-between border-b py-2">
        <div>
          <Link href={"/"}>Home</Link>
        </div>
        <div className="flex-center gap-2">
          <ModeToggle />
          <Button variant={"ghost"} size={"icon"} className="">
            <UserIcon />
          </Button>
        </div>
      </div>
    </header>
  );
}
