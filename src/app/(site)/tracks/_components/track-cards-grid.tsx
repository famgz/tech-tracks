"use client";

import TrackCard from "@/app/(site)/tracks/_components/track-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrackWithExtraInfo } from "@/types/content";
import { LoaderCircleIcon, SearchXIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";

interface Props {
  filteredTracks: TrackWithExtraInfo[];
}

const ITEMS_PER_LOAD = 24;

export default function TrackCardsGrid({ filteredTracks }: Props) {
  const totalItems = useMemo(
    () => filteredTracks.length,
    [filteredTracks.length],
  );
  const [offset, setOffset] = useState(ITEMS_PER_LOAD);
  const hasMoreItems = useMemo(() => offset < totalItems, [totalItems, offset]);
  const [scrollTrigger, isInView] = useInView();
  const [visibleItems, setVisibleItems] = useState(
    filteredTracks.slice(0, offset),
  );

  function loadMoreItems() {
    if (hasMoreItems) {
      setTimeout(() => {
        setOffset((prev) => prev + ITEMS_PER_LOAD);
        setVisibleItems(filteredTracks.slice(0, offset + ITEMS_PER_LOAD));
      }, 700);
    }
  }

  useEffect(() => {
    if (isInView && hasMoreItems) {
      loadMoreItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView]);

  useEffect(() => {
    setOffset(ITEMS_PER_LOAD);
    setVisibleItems(filteredTracks.slice(0, ITEMS_PER_LOAD));
  }, [filteredTracks]);

  return (
    <>
      {filteredTracks.length > 0 ? (
        <ScrollArea className="-mr-2 h-[100px] flex-auto pr-4">
          <div className="grid gap-3 p-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleItems.map((t) => (
              <TrackCard track={t} key={t.id} />
            ))}
          </div>

          {hasMoreItems && (
            <div
              className="flex-center w-full py-4 text-muted-foreground"
              ref={scrollTrigger}
            >
              <LoaderCircleIcon className="size-8 animate-spin stroke-[2px] text-muted-foreground" />
            </div>
          )}
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
