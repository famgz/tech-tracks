import LessonsAccordion from "@/app/course/[id]/_components/lessons-accordion";
import BackButton from "@/components/buttons/back";
import { ScrollArea } from "@/components/ui/scroll-area";
import { db } from "@/lib/prisma";
import { YoutubeIcon } from "lucide-react";
import { notFound } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
  searchParams: { back: string };
}

export default async function CoursePage({ params, searchParams }: Props) {
  const { id } = params;

  const course = await db.course.findUnique({
    where: { id },
    include: { lessons: { include: { contents: true } } },
  });

  if (!course) return notFound();

  console.log(course);

  return (
    <div className="mx-auto flex size-full max-w-[1920px] flex-col">
      <div className="grid h-full grid-cols-[2fr_1fr]">
        <div className="flex-center flex-col border-r">
          <div className="flex w-full items-center justify-start gap-3 px-5 py-3">
            <BackButton backUrl={searchParams.back} />
            <h1 className="text-xl">{course.name}</h1>
          </div>
          <YoutubeIcon
            className="size-44 flex-1 text-muted-foreground"
            strokeWidth={1}
          />
        </div>

        <div className="flex h-full flex-col">
          <h1 className="px-5 py-3 text-xl text-muted-foreground">Lições</h1>
          <ScrollArea className="h-[100px] flex-auto">
            <LessonsAccordion lessons={course.lessons} />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
