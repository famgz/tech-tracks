import { ModeToggle } from "@/components/buttons/mode-toggle";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-zinc-900">
      <div className="_container flex items-center justify-between py-4">
        <div>
          <Link href={"/"}>Home</Link>
        </div>
        <ModeToggle />
      </div>
    </header>
  );
}
