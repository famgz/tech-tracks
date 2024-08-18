import Filters from "@/app/tracks/_components/filters";
import TrackCard from "@/app/tracks/_components/track-card";
import { auth } from "@/auth";
import { ScrollArea } from "@/components/ui/scroll-area";
import { db } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";

interface Props {
  searchParams: {
    search: string;
    career: string;
    corporate: string;
    level: string;
    skill: string;
  };
}

export interface IFilters {
  career: Prisma.CareerGetPayload<{ include: { _count: true } }>[];
  corporate: Prisma.CorporateGetPayload<{ include: { _count: true } }>[];
  level: { id: string; name: string }[];
  skill: Prisma.SkillGetPayload<{ include: { _count: true } }>[];
}

export default async function TracksPage({ searchParams }: Props) {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const [skill, career, corporate, tracks] = await Promise.all([
    db.skill.findMany({ orderBy: { name: "asc" }, include: { _count: true } }),
    db.career.findMany({ orderBy: { name: "asc" }, include: { _count: true } }),
    db.corporate.findMany({
      orderBy: { name: "asc" },
      include: { _count: true },
    }),
    db.track.findMany({
      include: { skills: true, corporate: true, careers: true },
    }),
  ]);

  const filters: IFilters = {
    level: [
      { id: "1", name: "Iniciante" },
      { id: "2", name: "Intermediário" },
      { id: "3", name: "Avançado" },
    ],
    career,
    corporate,
    skill,
  };

  const normalizeParams = (param: string | string[]) =>
    Array.isArray(param) || param === undefined ? param : [param];

  const parsedSearchParams = {
    search: searchParams.search,
    career: normalizeParams(searchParams.career),
    corporate: normalizeParams(searchParams.corporate),
    level: normalizeParams(searchParams.level),
    skill: normalizeParams(searchParams.skill),
  };

  const filteredTracks = Object.values(parsedSearchParams).every(
    (x) => x === undefined,
  )
    ? tracks
    : tracks.filter(
        (t) =>
          // search
          (!parsedSearchParams.search ||
            t.name.toLowerCase().includes(parsedSearchParams.search)) &&
          // level
          (!parsedSearchParams.level ||
            parsedSearchParams.level.includes(t.level.toString())) &&
          // skill
          (!parsedSearchParams.skill ||
            t.skills.some((skill) =>
              parsedSearchParams.skill.includes(skill.id),
            )) &&
          // career
          (!parsedSearchParams.career ||
            t.careers.some((career) =>
              parsedSearchParams.career.includes(career.id),
            )) &&
          // corporate
          (!parsedSearchParams.corporate ||
            parsedSearchParams.corporate.includes(t.corporate.id)),
      );

  return (
    <div className="_container flex flex-col py-2">
      <h1 className="py-2 text-center text-3xl font-bold">Tracks</h1>

      <div className="flex flex-1 gap-6">
        {/* Filters column */}
        <Filters filters={filters} className="max-sm:hidden" />

        {/* Cards column */}
        <div className="flex flex-1 flex-col">
          <span className="mb-2">{filteredTracks.length} tracks</span>
          {filteredTracks.length > 0 ? (
            <ScrollArea className="-mr-2 h-[100px] flex-auto pr-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredTracks.map((t) => (
                  <TrackCard track={t} key={t.id} />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex-center h-full w-full text-xl text-muted-foreground">
              No results
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
