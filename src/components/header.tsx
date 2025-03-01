import { ModeToggle } from "@/components/buttons/mode-toggle";
import Logo from "@/components/icons/logo";
import LogoFullIcon from "@/components/icons/logo-full";
import Menu from "@/components/menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default async function Header() {
  return (
    <header>
      <Card className="rounded-t-none">
        <CardContent className="_container flex items-center justify-between py-3">
          <div className="flex items-center">
            <Button variant={"ghost"} asChild>
              <Link href={"/"} className="flex-center">
                <Logo className="mobile-only mt-2 size-7" />
                <LogoFullIcon className="desktop-only" />
              </Link>
            </Button>

            <Button asChild variant={"ghost"}>
              <Link href={"/tracks"} className="font-semibold">
                Trilhas
              </Link>
            </Button>
          </div>

          <div className="flex-center gap-2.5">
            <ModeToggle />
            <Menu />
          </div>
        </CardContent>
      </Card>
    </header>
  );
}
