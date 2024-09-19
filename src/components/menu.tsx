import LogoutButton from "@/components/buttons/logout";
import LoginDialog from "@/components/login-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogInIcon, MenuIcon } from "lucide-react";
import { auth } from "../auth";

export default async function Menu() {
  const session = await auth();
  const user = session?.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <MenuIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="min-w-48 p-2 text-sm" align={"end"}>
        {user ? (
          <>
            <DropdownMenuLabel className="flex items-center gap-4 p-3">
              <Avatar>
                <AvatarImage src={user.image || ""} alt="user avatar" />
                <AvatarFallback>
                  {user.name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div>
                <p className="">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Ongoing tracks</DropdownMenuItem>
            <DropdownMenuItem>Completed tracks</DropdownMenuItem>
            <DropdownMenuItem>Completed courses</DropdownMenuItem>

            <DropdownMenuSeparator className="mt-6" />

            <div>
              <LogoutButton />
            </div>
          </>
        ) : (
          <LoginDialog>
            <Button
              variant={"ghost"}
              className="w-full justify-between gap-3 px-3"
              type="submit"
            >
              Login
              <LogInIcon size={18} />
            </Button>
          </LoginDialog>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
