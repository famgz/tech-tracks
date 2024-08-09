import { buttonVariants } from "@/components/ui/button";
import { db } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { auth } from "../../auth";
import LoginButton from "@/components/buttons/login";

export default async function Home() {
  const session = await auth();
  const tracks = await db.track.findMany({ take: 10 });

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
          <LoginButton />
        )}
      </div>
    </div>
  );
}
