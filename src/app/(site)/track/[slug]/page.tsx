import { getSessionUserElseRedirectToLogin } from "@/actions/auth";
import { getTrackWithModulesAndCourses } from "@/actions/content";
import { getUserTrack, isUserAllowedToEnroll } from "@/actions/user-content";
import BookmarkTrackButton from "@/app/(site)/track/[slug]/_components/bookmark-track-button";
import EnrollTrackButton from "@/app/(site)/track/[slug]/_components/enroll-track-button";
import EnrollTrackDialog from "@/app/(site)/track/[slug]/_components/enroll-track-dialog";
import ModulesAccordion from "@/app/(site)/track/[slug]/_components/modules-accordion";
import ChartFilledIcon from "@/components/icons/chart-filed";
import { baseAssetsUrl } from "@/constants/api";
import { translate } from "@/lib/translate";
import { ClockIcon, DotIcon, LandmarkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";

interface Props {
  params: {
    slug: string;
  };
}

export default async function TrackPage({ params }: Props) {
  const user = await getSessionUserElseRedirectToLogin();

  const { slug } = params;
  const track = await getTrackWithModulesAndCourses(slug);
  if (!track) {
    return notFound();
  }

  const userTrack = await getUserTrack(user.id, track.id);
  const isEnrolled = !!userTrack?.isEnrolled;
  const isBookmarked = !!userTrack?.isBookmarked;

  const canEnroll = await isUserAllowedToEnroll(user.id);

  return (
    <div className="_container flex flex-col gap-12 py-10">
      {/* image and title */}
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="flex flex-1 flex-col items-center gap-4 sm:flex-row sm:gap-10">
          {/* track image */}
          <div className="relative size-32 shrink-0">
            <Image
              src={`${baseAssetsUrl}/${track.badge}`}
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
                    Nível {track.level}
                  </span>
                </div>

                {/* workload */}
                <div className="flex items-end gap-1">
                  <ClockIcon size={16} className="shrink-0" />
                  <span className="text-xs leading-none text-muted-foreground">
                    {track.workload}h
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
          <p className="text-sm">Patrocinador</p>
          <Link
            href={track.corporate.site || "#"}
            target={track.corporate.site ? "_blank" : "_self"}
          >
            <Image
              src={track.corporate.image_url}
              width={96}
              height={0}
              className="h-auto"
              alt={track.corporate.name}
              style={{ height: "auto" }}
            />
          </Link>
        </div>
      </div>

      {/* buttons */}
      <div className="flex flex-col items-center gap-4 max-sm:justify-center xs:flex-row">
        <BookmarkTrackButton
          trackId={track.id}
          userId={user.id}
          isBookmarked={isBookmarked}
        />
        <EnrollTrackButton isEnrolled={isEnrolled} />
      </div>

      {/* description */}
      <div
        className="pointer-events-none max-w-[1000px] font-light text-muted-foreground max-lg:text-sm"
        dangerouslySetInnerHTML={{
          __html: track.description,
        }}
      />

      {/* track content */}
      <div className="space-y-3">
        {/* track data */}
        <div className="flex items-center text-sm text-slate-400 max-sm:justify-center">
          {Object.entries(track.track_activities).map(([k, v], i, a) => {
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
        </div>

        {/* modules */}
        <div className="max-w-[1000px]">
          <ModulesAccordion
            modules={track.modules}
            isEnrolled={isEnrolled}
            isLoggedIn={!!user}
          />
        </div>
      </div>

      <EnrollTrackDialog
        trackId={track.id}
        userId={user.id}
        isEnrolled={isEnrolled}
        canEnroll={canEnroll}
      />
    </div>
  );
}
