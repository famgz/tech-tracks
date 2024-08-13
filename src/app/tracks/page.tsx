import Filters from "@/app/tracks/_components/filters";
import TrackCard from "@/app/tracks/_components/track-card";
import { auth } from "@/auth";
import { ScrollArea } from "@/components/ui/scroll-area";
import { db } from "@/lib/prisma";
import { SearchIcon } from "lucide-react";
import { redirect } from "next/navigation";

interface Props {
  searchParams: {
    skill: string;
    level: string;
    corporate: string;
    career: string;
  };
}

export default async function TracksPage({ searchParams }: Props) {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const [skill, career, corporate, tracks] = await Promise.all([
    db.skill.findMany({ orderBy: { name: "asc" } }),
    db.career.findMany({ orderBy: { name: "asc" } }),
    db.corporate.findMany({ orderBy: { name: "asc" } }),
    db.track.findMany({
      take: 100,
      include: { skills: true, corporate: true },
    }),
  ]);

  const filters = {
    level: [
      { id: "1", name: "Iniciante" },
      { id: "2", name: "Intermediário" },
      { id: "3", name: "Avançado" },
    ],
    career,
    corporate,
    skill,
  };

  return (
    <div className="_container flex flex-col py-2">
      <h1 className="py-2 text-center text-3xl font-bold">Tracks</h1>

      <div className="flex flex-1 gap-4">
        {/* Filters column */}
        <Filters filters={filters} className="max-sm:hidden" />

        {/* Cards column */}
        <div className="flex flex-1 flex-col">
          <span className="mb-2">191 tracks</span>
          <ScrollArea className="-mr-2 h-[100px] flex-auto pr-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
