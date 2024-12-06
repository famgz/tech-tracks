"use client";

import { getFirstVideoContentInCourse } from "@/actions/content";
import { enrollCourse, enrollModule } from "@/actions/user-content";
import ChartFilledIcon from "@/components/icons/chart-filed";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { translate } from "@/lib/translate";
import { cn } from "@/lib/utils";
import { useTrackStore } from "@/store/track";
import useStore from "@/store/use-store";
import { Course, Track, UserCourse } from "@prisma/client";
import { ArrowRightIcon, CheckIcon, ClockIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {
  course: Course;
  track: Track;
  moduleId: string;
  userCourse: UserCourse | null;
  isEnrolled: boolean;
  openEnrollTrackDialog: () => void;
}

export default function CourseCard({
  course,
  track,
  moduleId,
  userCourse,
  isEnrolled,
  openEnrollTrackDialog,
}: Props) {
  const trackStore = useStore(useTrackStore, (state) => state!);
  const router = useRouter();
  const isCourseType = course.type === "course";

  async function goToCourse() {
    const firstVideoContent = await getFirstVideoContentInCourse(course.id);
    const contentParam = firstVideoContent
      ? `&content=${firstVideoContent.id}`
      : "";
    trackStore?.setCurrentTrack(track);
    await enrollCourse(course.id);
    enrollModule(moduleId);
    router.push(`/course/${course.id}?track=${track.slug}${contentParam}`);
  }

  function handleClick() {
    if (!isEnrolled) {
      return openEnrollTrackDialog();
    }

    if (isCourseType) {
      return goToCourse();
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
            <p className="text-muted-foreground">{translate(course.type)}</p>
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
                {translate(course.level)}
              </span>
            </div>

            {/* workload */}
            <div className="flex items-end gap-1">
              <ClockIcon size={16} />
              <span className="text-xs leading-none text-muted-foreground">
                {course.workloadHours}h
              </span>
            </div>
          </div>
        </div>

        {course.type === "course" && (
          <Button
            onClick={handleClick}
            disabled={course.type !== "course"}
            className="gap-1 px-3 font-semibold sm:min-w-32"
          >
            {userCourse?.isCompleted ? (
              <>
                <span className="max-sm:hidden">Finalizado</span>
                <CheckIcon className="size-5" strokeWidth={2.5} />
              </>
            ) : (
              <>
                <span className="max-sm:hidden">
                  {userCourse ? "Continuar" : "Iniciar"}
                </span>
                <ArrowRightIcon className="size-5" strokeWidth={2.5} />
              </>
            )}
          </Button>
        )}
      </CardHeader>
    </Card>
  );
}
