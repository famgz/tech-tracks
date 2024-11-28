import { getSessionUserElseRedirectToLogin } from "@/actions/auth";
import { getTrackWithModulesAndCourses } from "@/actions/content";
import {
  getAllUserTracksInTrack,
  getUserTrack,
  isUserAllowedToEnroll,
} from "@/actions/user-content";
import BookmarkTrackButton from "@/app/(site)/track/[slug]/_components/bookmark-track-button";
import EnrollTrackButton from "@/app/(site)/track/[slug]/_components/enroll-track-button";
import EnrollTrackDialog from "@/app/(site)/track/[slug]/_components/enroll-track-dialog";
import ModulesAccordion from "@/app/(site)/track/[slug]/_components/modules-accordion";
import FeedbackButton from "@/app/(site)/track/[slug]/_components/feedback-button";
import ChartFilledIcon from "@/components/icons/chart-filed";
import StarRating from "@/components/star-rating";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { baseAssetsUrl } from "@/constants/api";
import { translate } from "@/lib/translate";
import { ClockIcon, DotIcon, LandmarkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Props {
  params: {
    slug: string;
  };
}

export default async function TrackPage({ params }: Props) {
  const user = await getSessionUserElseRedirectToLogin();
  const { slug } = params;

  const [track, allUserTracksInTrack] = await Promise.all([
    getTrackWithModulesAndCourses(slug),
    getAllUserTracksInTrack(slug),
  ]);

  if (!(track && allUserTracksInTrack)) {
    return notFound();
  }

  const allUserTracksInTrackFeedback = allUserTracksInTrack.filter(
    (x) => x.rating || x.comment,
  );

  const userTrack = await getUserTrack(track.id);
  const isEnrolled = !!userTrack?.isEnrolled;
  const isBookmarked = !!userTrack?.isBookmarked;

  const canEnroll = await isUserAllowedToEnroll();

  return (
    <div className="_container flex flex-col gap-12 py-10">
      {/* image and title */}
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="flex flex-1 flex-col items-center gap-4 sm:flex-row sm:gap-10">
          {/* track image */}
          <div className="relative size-32 shrink-0">
            <Image
              src={
                track.badge.startsWith("tracks/")
                  ? `${baseAssetsUrl}/${track.badge}`
                  : track.badge
              }
              fill
              alt={track.name}
              className="object-contain"
              sizes="128px"
            />
          </div>

          <div className="space-y-5">
            <h1 className="text-3xl font-bold max-sm:text-center">
              {track.name}
            </h1>

            {/* stats */}
            <div className="space-y-2">
              <div className="flex items-center gap-6 max-sm:justify-center">
                {/* level */}
                <div className="flex items-end gap-1">
                  <ChartFilledIcon fontSize={16} className="fill-primary" />
                  <span className="whitespace-nowrap text-xs leading-none text-muted-foreground">
                    {translate(track.level)}
                  </span>
                </div>

                {/* workload */}
                <div className="flex items-end gap-1">
                  <ClockIcon size={16} className="shrink-0" />
                  <span className="text-xs leading-none text-muted-foreground">
                    {track.workloadHours}h
                  </span>
                </div>

                {/* corporate */}
                <div className="flex items-end gap-1">
                  <LandmarkIcon size={16} className="shrink-0" />
                  <span className="line-clamp-1 text-xs leading-none text-muted-foreground">
                    {track.corporate.name}
                  </span>
                </div>
              </div>

              {/* skills */}
              <div className="flex max-w-[500px] flex-wrap items-center max-sm:justify-center">
                {track.skills.map((s, i, a) => (
                  <Fragment key={s.id}>
                    <span className="text-xs font-semibold">{s.name}</span>

                    {i < a.length - 1 && (
                      <DotIcon className="text-muted-foreground" />
                    )}
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Corporate logo */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-light">Patrocinador</p>

          <Link
            href={
              track.corporate.site ? new URL(track.corporate.site).href : "#"
            }
            target={track.corporate.site ? "_blank" : "_self"}
            className="flex-center min-h-9"
          >
            <Image
              src={track.corporate.imageUrl}
              width={128}
              height={0}
              alt={track.corporate.name}
              style={{ height: "auto" }}
              title={track.corporate.name}
            />
          </Link>
          <div className="flex-center flex-col">
            <p className="text-sm font-medium">{track.corporate.name}</p>
            <Button asChild variant={"link"} size={"sm"}>
              <Link
                href={`/tracks?corporate=${track.corporateId}`}
                className="h-fit w-full text-center text-xs !text-muted-foreground"
              >
                ver mais
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-12 sm:grid sm:grid-cols-[3fr_1fr]">
        {/* left column (desktop) */}
        <div className="space-y-12">
          {/* buttons */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-start">
              <BookmarkTrackButton
                trackId={track.id}
                isBookmarked={isBookmarked}
              />
              <EnrollTrackButton isEnrolled={isEnrolled} />
            </div>

            {isEnrolled && (
              <FeedbackButton userTrack={userTrack} track={track} />
            )}
          </div>

          {/* description */}
          <div
            className={cn(
              "max-w-[1000px] font-light text-muted-foreground max-lg:text-sm",
              { "pointer-events-none": !track.allowHTMLDescription },
            )}
            dangerouslySetInnerHTML={{
              __html: track.description,
            }}
          />

          {/* track content */}
          <div className="space-y-3">
            <div>
              <h2 className="text-xl font-medium">Módulos</h2>
              {/* track data */}
              {/* <div className="flex items-center text-sm text-slate-400 max-sm:justify-center">
                {track?.track_activities &&
                  Object.entries(track.track_activities).map(([k, v], i, a) => {
                    if (i === a.length - 1) return;
                    if (!v) return;
                    return (
                      <Fragment key={k}>
                        <p>
                          {v} {translate(k)}
                        </p>
                        {i < a.length - 2 && (
                          <DotIcon className="text-muted-foreground" />
                        )}
                      </Fragment>
                    );
                  })}
              </div> */}
            </div>

            {/* modules */}
            <div className="max-w-[1000px]">
              <ModulesAccordion
                modules={track.modules}
                track={track}
                isEnrolled={isEnrolled}
                isLoggedIn={!!user}
              />
            </div>
          </div>
        </div>

        {/* right column (desktop) */}
        <div className="flex flex-col gap-12">
          {/* enrolled users */}
          <div className="space-y-3">
            <h3 className="text-xl font-medium">Alunos matriculados</h3>
            <p className="text-sm text-muted-foreground">
              {allUserTracksInTrack.length > 0 ? (
                <span>
                  {allUserTracksInTrack.length} aluno
                  {allUserTracksInTrack.length > 1 && "s"} já se{" "}
                  {allUserTracksInTrack.length > 1
                    ? "matricularam"
                    : "matriculou"}
                </span>
              ) : (
                <span>Seja o primeiro aluno a se matricular!</span>
              )}
            </p>
            {allUserTracksInTrack.length > 0 && (
              <div className="flex -space-x-2.5">
                {allUserTracksInTrack.map((x) => (
                  <Avatar
                    className="size-10 border-2 border-primary/60"
                    key={x.trackId + x.userId}
                    title={x.User.name || ""}
                  >
                    <AvatarImage
                      src={x.User.image || ""}
                      alt="enrolled user avatar"
                    />
                    <AvatarFallback>
                      {x.User.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            )}
          </div>

          {/* feedbacks */}
          {allUserTracksInTrack.length > 0 && (
            <div className="flex flex-1 flex-col gap-3">
              <h3 className="text-xl font-medium">Feedback Alunos</h3>
              {allUserTracksInTrackFeedback.length > 0 ? (
                <ScrollArea className="h-[min(fit,400px)] flex-auto">
                  <div className="space-y-6">
                    {allUserTracksInTrackFeedback.map((t) => (
                      <div key={t.trackId + t.userId} className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Avatar
                            className="size-8"
                            key={t.trackId + t.userId}
                            title={t.User.name || ""}
                          >
                            <AvatarImage
                              src={t.User.image || ""}
                              alt="enrolled user avatar"
                            />
                            <AvatarFallback>
                              {t.User.name?.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <p>{t.User.name}</p>
                        </div>
                        {t.rating && <StarRating rating={t.rating} />}
                        <p className="text-sm text-muted-foreground">
                          {t.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhum feedback encontrado para este curso.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <EnrollTrackDialog
        trackId={track.id}
        isEnrolled={isEnrolled}
        canEnroll={canEnroll}
      />
    </div>
  );
}
