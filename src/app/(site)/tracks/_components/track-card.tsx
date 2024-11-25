import ChartIcon from "@/components/icons/chart";
import { buttonVariants } from "@/components/ui/button";
import { HoverCard, HoverCardContent } from "@/components/ui/hover-card";
import { baseAssetsUrl } from "@/constants/api";
import { translate } from "@/lib/translate";
import { cn } from "@/lib/utils";
import { TrackWithExtras } from "@/types/content";
import { HoverCardTrigger } from "@radix-ui/react-hover-card";
import { ClockIcon, DotIcon, LandmarkIcon, PlayIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";

interface Props {
  track: TrackWithExtras;
}

export default function TrackCard({ track }: Props) {
  return (
    <HoverCard openDelay={700} closeDelay={0}>
      <HoverCardTrigger asChild>
        <Link
          href={`/track/${track.slug}`}
          className="relative aspect-[1200/564] min-w-[200px] cursor-pointer overflow-hidden rounded-lg transition-transform duration-200 hover:scale-[102%]"
        >
          <Image
            src={track.banner}
            fill
            alt=""
            className="object-cover"
            sizes="(max-width: 640px) 80vw, (max-width: 768px) 40vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 400px"
          />
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="flex items-center gap-4" sideOffset={-50}>
        <div className="relative size-24 shrink-0">
          <Image
            src={
              track.badge.startsWith("tracks/")
                ? `${baseAssetsUrl}/${track.badge}`
                : track.badge
            }
            fill
            alt={track.name}
            className="object-contain"
            sizes="100px"
          />
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <h3 className="line-clamp-2 text-sm font-bold">{track.name}</h3>

          <div className="flex items-center gap-2">
            <div className="flex flex-1 items-center gap-3 font-light">
              {/* level */}
              <div className="flex items-end gap-1">
                <ChartIcon fontSize={14} />
                <span className="whitespace-nowrap text-[10px] capitalize leading-none">
                  {translate(track.level)}
                </span>
              </div>

              {/* workload */}
              <div className="flex items-end gap-1">
                <ClockIcon size={14} />
                <span className="text-[10px] leading-none">
                  {track.workloadHours}h
                </span>
              </div>

              {/* corporate */}
              <div className="flex items-end gap-1">
                <LandmarkIcon size={14} />
                <span className="line-clamp-1 text-[10px] leading-none">
                  {track.corporate.name}
                </span>
              </div>
            </div>

            <Link
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "size-7 rounded-full bg-foreground",
              )}
              href={`/track/${track.slug}`}
            >
              <PlayIcon
                className="fill-background stroke-none hover:fill-foreground"
                size={18}
              />
            </Link>
          </div>

          <div className="flex flex-wrap items-center">
            {track.skills.map((s, i, a) => (
              <Fragment key={s.id}>
                <span className="text-[10px] font-semibold">{s.name}</span>

                {i < a.length - 1 && (
                  <DotIcon className="text-muted-foreground" />
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
