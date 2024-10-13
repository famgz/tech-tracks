"use client";

import TrackCard from "@/app/(site)/tracks/_components/track-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrackWithExtraInfo } from "@/types/content";
import { SearchXIcon } from "lucide-react";

interface Props {
  filteredTracks: TrackWithExtraInfo[];
}

export default function TrackCardsGrid({ filteredTracks }: Props) {
  return (
    <>
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
    </>
  );
}
