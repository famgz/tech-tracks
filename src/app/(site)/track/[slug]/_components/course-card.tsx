"use client";

import ChartFilledIcon from "@/components/icons/chart-filed";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { translate } from "@/lib/translate";
import { cn } from "@/lib/utils";
import { useTrackStore } from "@/store/track";
import useStore from "@/store/use-store";
import { Course, Track } from "@prisma/client";
import { ArrowRightIcon, ClockIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {
  course: Course;
  track: Track;
  isLoggedIn: boolean;
  isEnrolled: boolean;
  openEnrollTrackDialog: () => void;
}

export default function CourseCard({
  course,
  track,
  isLoggedIn,
  isEnrolled,
  openEnrollTrackDialog,
}: Props) {
  const trackStore = useStore(useTrackStore, (state) => state!);
  const router = useRouter();
  const isCourseType = course.type === "course";

  async function handleGoToCourse() {
    trackStore?.setCurrentTrack(track);
    router.push(`/course/${course.id}?track=${track.slug}`);
  }

  function handleClick() {
    if (!isEnrolled) {
      return openEnrollTrackDialog();
    }

    if (isCourseType) {
      return handleGoToCourse();
    }
  }

  return (
    <Card
      className={cn("overflow-hidden bg-muted", {
        "cursor-pointer hover:bg-muted-foreground/20": isCourseType,
        "opacity-50": !isCourseType,
      })}
      onClick={handleClick}
    >
      <CardHeader className="relative flex-row items-center gap-4 space-y-0 max-lg:p-4">
        {!isCourseType && (
          <div className="flex-center absolute inset-0 z-50 size-full cursor-not-allowed bg-background/90 p-10 opacity-0 transition-opacity duration-200 hover:opacity-100">
            <span className="max-w-[300px] text-center">
              No momento apenas cursos com conteúdos de aulas são suportados na
              plataforma :(
            </span>
          </div>
        )}

        <Image
          src={course.badge}
          width={64}
          height={64}
          alt="course badge"
          className="size-14 lg:size-16"
          style={{ width: "auto" }}
        />

        <div className="flex-1 space-y-4 overflow-hidden">
          {/* course type and title */}
          <div className="space-y-1">
            <p className="capitalize text-muted-foreground">
              {translate(course.type)}
            </p>
            <p
              className="truncate font-semibold"
              title={isCourseType ? course.name : undefined}
            >
              {course.name}
            </p>
          </div>

          {/* course stats */}
          <div className="flex items-center gap-3">
            {/* level */}
            <div className="flex items-end gap-1">
              <ChartFilledIcon fontSize={16} className="fill-primary" />
              <span className="whitespace-nowrap text-xs leading-none text-muted-foreground">
                {course.level}
              </span>
            </div>

            {/* workload */}
            <div className="flex items-end gap-1">
              <ClockIcon size={16} />
              <span className="text-xs leading-none text-muted-foreground">
                {course.workload}h
              </span>
            </div>
          </div>
        </div>

        {course.type === "course" && (
          <div className="flex-center">
            <Button
              onClick={handleClick}
              disabled={course.type !== "course"}
              className="gap-1 px-3"
            >
              <span className="max-sm:hidden">Iniciar</span>
              <ArrowRightIcon className="size-5" />
            </Button>
          </div>
        )}
      </CardHeader>
    </Card>
  );
}
