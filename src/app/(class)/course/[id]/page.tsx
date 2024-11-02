import { getSessionUserElseRedirectToLogin } from "@/actions/auth";
import {
  getCourseWithLessonsAndContents,
  getTrackWithModulesAndCourses,
  isCourseInTrack,
} from "@/actions/content";
import { getUserCourse } from "@/actions/user-content";
import LessonsAccordion from "@/app/(class)/course/[id]/_components/lessons-accordion";
import YouTubeEmbed from "@/app/(class)/course/[id]/_components/youtube-embed";
import BackButton from "@/components/buttons/back";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getVideoContent } from "@/lib/utils";
import { YoutubeIcon } from "lucide-react";
import { notFound, redirect } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
  searchParams: { track: string; content: string };
}

export default async function CoursePage({ params, searchParams }: Props) {
  const user = await getSessionUserElseRedirectToLogin();
  const { id } = params;

  const [track, course] = await Promise.all([
    getTrackWithModulesAndCourses(searchParams.track),
    getCourseWithLessonsAndContents(id),
  ]);
  if (!(track && course)) return notFound();

  const isCourseInCurrentTrack = await isCourseInTrack(track.id, course.id);

  console.log({ isCourseInCurrentTrack });

  if(!isCourseInCurrentTrack) redirect('/')

  const userCourse = await getUserCourse(user.id, course.id);

  const currentVideoContent = getVideoContent(course, searchParams.content);
  const videoId = currentVideoContent?.youtube_code;

  return (
    <div className="mx-auto flex size-full max-w-[1920px] flex-col">
      <div className="flex h-full flex-col lg:grid lg:grid-cols-[3fr_1fr]">
        {/* video frame */}
        <div className="flex-center flex-1 flex-col border-r">
          <div className="flex w-full items-center justify-start gap-3 px-5 py-3">
            <BackButton backUrl={`/track/${searchParams.track}`} />
            <h1 className="text-lg lg:text-xl">{course.name}</h1>
          </div>
          {!!videoId ? (
            <YouTubeEmbed videoId={videoId} />
          ) : (
            <div className="flex-center flex-1 flex-col gap-5 text-muted-foreground">
              <YoutubeIcon
                className="size-44 text-muted-foreground/70"
                strokeWidth={0.7}
              />
              <p className="px-3 text-center text-lg">
                Selecione uma aula para carregar um vídeo
              </p>
            </div>
          )}
        </div>

        {/* lessons list */}
        <div className="flex min-h-[300px] flex-col lg:h-full">
          <h1 className="px-5 py-3 text-xl text-muted-foreground max-lg:border-t">
            Lições
          </h1>
          <ScrollArea className="h-[100px] flex-auto">
            <LessonsAccordion lessons={course.lessons} />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
