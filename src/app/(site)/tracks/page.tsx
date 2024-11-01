import {
  getCareersWithCount,
  getCorporatesWithCount,
  getSkillsWithCount,
  getTracksWithExtras,
} from "@/actions/content";
import Filters from "@/app/(site)/tracks/_components/filters";
import TrackCardsGrid from "@/app/(site)/tracks/_components/track-cards-grid";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { IFilters } from "@/types/content";
import { FilterIcon } from "lucide-react";

export default async function TracksPage() {
  const [skill, career, corporate, tracks] = await Promise.all([
    getSkillsWithCount(),
    getCareersWithCount(),
    getCorporatesWithCount(),
    getTracksWithExtras(),
  ]);

  const filters: IFilters = {
    level: [
      { id: "1", name: "Iniciante" },
      { id: "2", name: "Intermediário" },
      { id: "3", name: "Avançado" },
    ],
    career: career!,
    skill: skill!,
    corporate: corporate!,
  };

  return (
    <div className="_container relative flex flex-1 flex-col pb-6 pt-2">
      <h1 className="py-3 text-center text-xl font-bold sm:text-3xl">
        Trilhas de Estudo
      </h1>

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

        {/* Track cards column */}
        <div className="flex flex-1 flex-col">
          <TrackCardsGrid tracks={tracks!} />
        </div>
      </div>
    </div>
  );
}
