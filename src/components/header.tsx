import { ModeToggle } from "@/components/buttons/mode-toggle";
import Logo from "@/components/icons/logo";
import Menu from "@/components/menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { auth } from "../auth";

export default async function Header() {
  const session = await auth();
  const user = session?.user;

  return (
    <header>
      <Card className="rounded-t-none">
        <CardContent className="_container flex items-center justify-between py-3">
          <div className="flex items-center gap-4">
            <Button variant={"ghost"}>
              <Logo />
            </Button>

            {user && (
              <Button asChild variant={"ghost"}>
                <Link href={"/tracks"} className="font-semibold">
                  Tracks
                </Link>
              </Button>
            )}
          </div>

          <div className="flex-center gap-2">
            <ModeToggle />

            <Menu />
          </div>
        </CardContent>
      </Card>
    </header>
  );
}
