import Filters from "@/app/tracks/_components/filters";
import TrackCard from "@/app/tracks/_components/track-card";
import { auth } from "@/auth";
import { ScrollArea } from "@/components/ui/scroll-area";
import { db } from "@/lib/prisma";
import { SearchIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function TracksPage() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const tracks = await db.track.findMany({
    take: 100,
    include: { skills: true },
  });

  return (
    <div className="_container flex flex-col py-2">
      <h1 className="py-2 text-center text-3xl font-bold">Tracks</h1>

      <div className="flex flex-1 gap-4">
        {/* Filters column */}
        <div className="flex max-w-fit flex-col">
          <span className="mb-2">Filters</span>
          <div className="flex-center mb-4 gap-2 rounded-lg border px-2 py-1">
            <SearchIcon className="size-4 text-muted-foreground" />
            <input className="flex-1 bg-transparent outline-none" size={1} />
          </div>
          <ScrollArea className="-mr-2 h-[100px] flex-auto pr-4">
            <Filters />
          </ScrollArea>
        </div>

        {/* Cards column */}
        <div className="flex flex-1 flex-col">
          <span className="mb-2">191 tracks</span>
          <ScrollArea className="-mr-2 h-[100px] flex-auto pr-4">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {tracks.map((t) => (
                <TrackCard track={t} key={t.id} />
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
