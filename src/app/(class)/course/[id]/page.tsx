import LessonsAccordion from "@/app/(class)/course/[id]/_components/lessons-accordion";
import BackButton from "@/components/buttons/back";
import Loading from "@/components/loading";
import { ScrollArea } from "@/components/ui/scroll-area";
import YouTubeEmbed from "@/components/youtube-embed";
import { db } from "@/lib/prisma";
import { isContentVideo } from "@/lib/utils";
import { YoutubeIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface Props {
  params: {
    id: string;
  };
  searchParams: { back: string; content: string };
}

export default async function CoursePage({ params, searchParams }: Props) {
  const { id } = params;

  const course = await db.course.findUnique({
    where: { id },
    include: { lessons: { include: { contents: true } } },
  });

  if (!course) return notFound();

  function getVideoContent() {
    for (const lesson of course!.lessons) {
      for (const content of lesson.contents) {
        if (content.id === searchParams.content && isContentVideo(content)) {
          return content;
        }
      }
    }
  }

  const currentVideoContent = getVideoContent();
  const videoId = currentVideoContent?.youtube_code;

  return (
    <Suspense fallback={<Loading />}>
      <div className="mx-auto flex size-full max-w-[1920px] flex-col">
        <div className="flex h-full flex-col lg:grid lg:grid-cols-[2fr_1fr]">
          {/* video frame */}
          <div className="flex-center flex-1 flex-col border-r">
            <div className="flex w-full items-center justify-start gap-3 px-5 py-3">
              <BackButton backUrl={searchParams.back} />
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
    </Suspense>
  );
}
