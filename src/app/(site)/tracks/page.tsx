import Filters from "@/app/(site)/tracks/_components/filters";
import TrackCard from "@/app/(site)/tracks/_components/track-card";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { db } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { FilterIcon, SearchXIcon } from "lucide-react";
import { Suspense } from "react";

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
  const [skill, career, corporate, tracks] = await Promise.all([
    db.skill.findMany({ orderBy: { name: "asc" }, include: { _count: true } }),
    db.career.findMany({ orderBy: { name: "asc" }, include: { _count: true } }),
    db.corporate.findMany({
      orderBy: { name: "asc" },
      include: { _count: true },
    }),
    db.track.findMany({
      include: { skills: true, corporate: true, careers: true },
      orderBy: { created: "desc" },
    }),
  ]);

  const filters: IFilters = {
    level: [
      { id: "1", name: "Iniciante" },
      { id: "2", name: "Intermediário" },
      { id: "3", name: "Avançado" },
    ],
    career,
    skill,
    corporate,
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
    <Suspense fallback={<Loading />}>
      <div className="_container relative flex flex-1 flex-col pb-6 pt-2">
        <h1 className="py-2 text-center text-3xl font-bold">Cursos</h1>

        <div className="flex flex-1 gap-6 sm:gap-4 xl:gap-8">
          {/* Filters column */}

          {/* desktop filters */}
          <Filters filters={filters} className="desktop-only" />

          {/* mobile filters */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant={"ghost"}
                size={"icon"}
                className="mobile-only absolute right-4 top-4"
              >
                <FilterIcon className="" />
              </Button>
            </SheetTrigger>
            <SheetContent className="mobile-only flex">
              <Filters filters={filters} className="flex-1" />
            </SheetContent>
          </Sheet>

          {/* Cards column */}
          <div className="flex flex-1 flex-col">
            <span className="mb-2 ml-2">
              {filteredTracks.length ? (
                <>
                  {filteredTracks.length} curso
                  {filteredTracks.length > 1 ? "s" : ""} encontrado
                  {filteredTracks.length > 1 ? "s" : ""}
                </>
              ) : (
                "Sem resultados"
              )}
            </span>
            {filteredTracks.length > 0 ? (
              <ScrollArea className="-mr-2 h-[100px] flex-auto pr-4">
                <div className="grid gap-3 p-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredTracks.map((t) => (
                    <TrackCard track={t} key={t.id} />
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex-center h-full w-full flex-col gap-6 text-2xl text-muted-foreground">
                <SearchXIcon className="size-16" />
                <p>Nenhum curso encontrado</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Suspense>
  );
}
