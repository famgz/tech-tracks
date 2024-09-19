import LoginDialog from "@/components/login-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { auth } from "../../auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="_container flex flex-col items-center py-10">
      <h1 className="py-4 text-3xl font-bold">Tech Tracks</h1>
      <div className="mt-10 flex-1">
        {session?.user ? (
          <div className="space-y-8">
            <p className="text-center text-xl">
              Hello, <span className="font-bold">{session.user.name}</span>
            </p>

            <Link
              href="/tracks"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "mx-auto text-xl font-bold",
              )}
            >
              Go to Tracks
            </Link>
          </div>
        ) : (
          <LoginDialog>
            <Button
              variant={"default"}
              size={"lg"}
              className="gap-1 text-xl font-bold"
            >
              Login to Access
            </Button>
          </LoginDialog>
        )}
      </div>
    </div>
  );
}
