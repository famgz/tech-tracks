import {
  getCareersWithCount,
  getCorporatesWithCount,
  getSkillsWithCount,
  getTracksWithExtras,
} from "@/actions/content";
import FiltersWrapper from "@/app/(site)/tracks/_components/filters-wrapper";
import TrackCardsGrid from "@/app/(site)/tracks/_components/track-cards-grid";
import { getLevelFilters } from "@/app/(site)/tracks/_helpers/filters";
import { IFilters } from "@/types/content";

export default async function TracksPage() {
  const [skill, career, corporate, tracks] = await Promise.all([
    getSkillsWithCount(),
    getCareersWithCount(),
    getCorporatesWithCount(),
    getTracksWithExtras(),
  ]);

  const filters: IFilters = {
    level: getLevelFilters(tracks!),
    career: career!,
    skill: skill!,
    corporate: corporate!,
  };

  console.log(filters.career);

  return (
    <div className="_container relative flex flex-1 flex-col pb-6 pt-2">
      <h1 className="py-3 text-center text-xl font-bold sm:text-3xl">
        Trilhas de Estudo
      </h1>

      <div className="flex flex-1 gap-6 sm:gap-4 xl:gap-8">
        <FiltersWrapper filters={filters} />
        <TrackCardsGrid tracks={tracks!} />
      </div>
    </div>
  );
}
