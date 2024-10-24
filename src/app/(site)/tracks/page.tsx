import Filters from "@/app/(site)/tracks/_components/filters";
import TrackCardsGrid from "@/app/(site)/tracks/_components/track-cards-grid";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { db } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { FilterIcon } from "lucide-react";

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
    <div className="_container relative flex flex-1 flex-col pb-6 pt-2">
      <h1 className="py-2 text-center text-3xl font-bold">Trilhas de Estudo</h1>

      <div className="flex flex-1 gap-6 sm:gap-4 xl:gap-8">
        {/* Filters column */}

        {/* desktop filters */}
        <Filters
          filters={filters}
          searchString={parsedSearchParams.search}
          className="desktop-only"
        />

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
            <Filters
              filters={filters}
              searchString={parsedSearchParams.search}
              className="flex-1"
            />
          </SheetContent>
        </Sheet>

        {/* Track cards column */}
        <div className="flex flex-1 flex-col">
          <span className="mb-2 ml-2">
            {filteredTracks.length ? (
              <>
                {filteredTracks.length} ite
                {filteredTracks.length > 1 ? "ns" : "m"} encontrado
                {filteredTracks.length > 1 ? "s" : ""}
              </>
            ) : (
              "Sem resultados"
            )}
          </span>
          <TrackCardsGrid filteredTracks={filteredTracks} />
        </div>
      </div>
    </div>
  );
}
