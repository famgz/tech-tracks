"use client";

import TrackCard from "@/app/(site)/tracks/_components/track-card";
import { parseSearchParams } from "@/app/(site)/tracks/_helpers/filters";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrackWithExtras } from "@/types/content";
import { SearchXIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface Props {
  tracks: TrackWithExtras[];
}

export default function TrackCardsGrid({ tracks }: Props) {
  const searchParams = useSearchParams();

  const parsedSearchParams = parseSearchParams(searchParams);

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
          (parsedSearchParams.level.length === 0 ||
            parsedSearchParams.level.includes(t.level.toString())) &&
          // skill
          (parsedSearchParams.skill.length === 0 ||
            t.skills.some((skill) =>
              parsedSearchParams.skill.includes(skill.id),
            )) &&
          // career
          (parsedSearchParams.career.length === 0 ||
            t.careers.some((career) =>
              parsedSearchParams.career.includes(career.id),
            )) &&
          // corporate
          (parsedSearchParams.corporate.length === 0 ||
            parsedSearchParams.corporate.includes(t.corporate.id)),
      );

  return (
    <>
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

      {filteredTracks.length > 0 ? (
        <ScrollArea className="-mr-2 h-[100px] flex-auto pr-4">
          <div className="grid gap-3 sm:grid-cols-2 sm:p-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTracks.map((t) => (
              <TrackCard track={t} key={t.id} />
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="flex-center h-full w-full flex-col gap-6 text-2xl text-muted-foreground">
          <SearchXIcon className="size-16" />
          <p>Nenhum item encontrado</p>
        </div>
      )}
    </>
  );
}
