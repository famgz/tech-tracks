import LoginButton from "@/components/buttons/login";
import { ModeToggle } from "@/components/buttons/mode-toggle";
import Link from "next/link";
import { auth } from "../auth";
import { MenuIcon, UserIcon } from "lucide-react";
import LogoutButton from "@/components/buttons/logout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default async function Header() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="_container">
      <div className="flex items-center justify-between border-b py-2">
        <div className="flex items-center gap-2">
          <Link href={"/"}>Home</Link>
        </div>

        <div className="flex-center gap-2">
          <ModeToggle />

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} size={"icon"}>
                  <MenuIcon />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="">
                <DropdownMenuLabel className="flex items-center gap-4 p-3">
                  <Avatar>
                    <AvatarImage src={user.image || ""} alt="user avatar" />
                    <AvatarFallback>
                      {user.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <p className="">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Ongoing tracks</DropdownMenuItem>
                <DropdownMenuItem>Completed tracks</DropdownMenuItem>

                <DropdownMenuSeparator className="mt-6" />

                <div className="">
                  <LogoutButton />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
