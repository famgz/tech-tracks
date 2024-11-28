import RemoveTrackStateButton from "@/app/(site)/user/_components/remove-track-state-button";
import { baseAssetsUrl } from "@/constants/api";
import { cn } from "@/lib/utils";
import { Track } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

interface Props {
  track: Track | undefined;
  type?: "enroll" | "bookmark" | "no-action";
}

export default function TrackSlot({ track, type = "no-action" }: Props) {
  return (
    <Link
      href={track ? `/track/${track.slug}` : "/tracks"}
      className={cn(
        "relative flex aspect-[1200/564] size-full cursor-pointer rounded-lg border border-muted-foreground p-3 text-center text-sm text-muted-foreground hover:bg-muted/40",
        { "border-dashed bg-muted/70 hover:bg-muted": !track },
      )}
    >
      {track ? (
        <div className="flex flex-1 flex-col items-center justify-between">
          <div className="absolute right-2 top-2 z-10">
            <RemoveTrackStateButton trackId={track.id} type={type} />
          </div>

          <div className="relative size-full max-h-36 flex-1">
            <Image
              src={
                track.badge.startsWith("tracks/")
                  ? `${baseAssetsUrl}/${track.badge}`
                  : track.badge
              }
              alt={track.name}
              fill
              className="object-contain"
              sizes="(max-width: 640px) 30vw, 10vw"
            />
          </div>
          <span className="line-clamp-2">{track.name}</span>
        </div>
      ) : (
        <div className="flex-center flex-1">
          <span className="">Clique para inicar uma nova trilha</span>
        </div>
      )}
    </Link>
  );
}
