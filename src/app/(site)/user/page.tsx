import TrackCard from "@/app/(site)/tracks/_components/track-card";
import { auth } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/prisma";
import { translate } from "@/lib/translate";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function UserPage() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const mockedTracks = await db.track.findMany({
    include: { skills: true, corporate: true, careers: true },
    orderBy: { created: "desc" },
    take: 9,
  });

  const user = session.user;

  return (
    <div className="_container flex-center flex-col py-10">
      <Card className="w-full max-w-5xl flex-1">
        <CardHeader className="items-center gap-8">
          <div className="flex-center flex-col gap-2">
            <CardTitle>{user.name}</CardTitle>
            <CardDescription className="text-center">
              <p>{user.email}</p>
              <p className="capitalze">({translate(user.role)})</p>
            </CardDescription>
          </div>

          <Avatar className="size-40">
            <AvatarImage src={user.image || ""} alt="user avatar" />
            <AvatarFallback>
              {user.name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </CardHeader>

        <CardContent>
          <div className="space-y-10">
            <div className="space-y-2">
              <h2 className="text-lg">Trilhas em andamento</h2>
              <div className="flex flex-col gap-2 sm:grid sm:grid-cols-3">
                {mockedTracks.slice(0, 2).map((t) => (
                  <TrackCard track={t} key={t.id} />
                ))}

                <Link
                  href={"/tracks"}
                  className="flex-center aspect-[1200/564] size-full cursor-pointer rounded-lg border border-dashed border-muted-foreground bg-muted/70 py-10 text-center text-muted-foreground hover:bg-muted"
                >
                  Clique para inicar uma nova trilha
                </Link>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg">Trilhas finalizadas</h2>
              <div className="flex flex-col gap-2 sm:grid sm:grid-cols-3">
                {mockedTracks.slice(3, 6).map((t) => (
                  <TrackCard track={t} key={t.id} />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg">Trilhas desejadas</h2>
              <div className="flex flex-col gap-2 sm:grid sm:grid-cols-3">
                {mockedTracks.slice(6).map((t) => (
                  <TrackCard track={t} key={t.id} />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
