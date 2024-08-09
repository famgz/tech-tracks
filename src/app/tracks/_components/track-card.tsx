import ChartIcon from "@/components/icons/chart";
import { buttonVariants } from "@/components/ui/button";
import { HoverCard, HoverCardContent } from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { HoverCardTrigger } from "@radix-ui/react-hover-card";
import { ClockIcon, DotIcon, PlayIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  track: Prisma.TrackGetPayload<{
    include: {
      skills: true;
    };
  }>;
}

export default function TrackCard({ track }: Props) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link
          href={`/tracks/${track.slug}`}
          className="relative aspect-[1200/564] min-w-[200px] cursor-pointer overflow-hidden rounded-lg"
        >
          <Image
            src={track.preview}
            fill
            alt=""
            className="object-cover"
            sizes="(max-width: 768px) 60vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 235px"
          />
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="flex flex-col gap-2.5" sideOffset={-50}>
        <h3 className="line-clamp-2 text-sm font-bold">{track.name}</h3>

        <div className="flex items-center">
          <div className="flex flex-1 items-center gap-3 font-light">
            <div className="flex items-end gap-1">
              <ChartIcon fontSize={14} />
              <span className="text-[10px] leading-none">
                Nível {track.level}
              </span>
            </div>

            <div className="flex items-end gap-1">
              <ClockIcon size={14} />
              <span className="text-[10px] leading-none">
                {track.workload}h
              </span>
            </div>
          </div>

          <Link
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "size-7 rounded-full bg-foreground",
            )}
            href={`/tracks/${track.slug}`}
          >
            <PlayIcon
              className="fill-background stroke-none hover:fill-foreground"
              size={18}
            />
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-x-1 gap-y-0">
          {track.skills.map((s, i, a) => (
            <>
              <span className="text-[10px] font-semibold" key={s.id}>
                {s.name}
              </span>

              {i < a.length - 1 && (
                <DotIcon className="text-muted-foreground" />
              )}
            </>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
