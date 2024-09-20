import LessonsAccordion from "@/app/course/[id]/_components/lessons-accordion";
import { db } from "@/lib/prisma";
import { YoutubeIcon } from "lucide-react";
import { notFound } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

export default async function CoursePage({ params }: Props) {
  const { id } = params;

  const course = await db.course.findUnique({
    where: { id },
    include: { lessons: { include: { contents: true } } },
  });

  if (!course) return notFound();

  console.log(course);

  return (
    <div className="mx-auto flex size-full max-w-[1920px] flex-col">
      <div className="grid h-full grid-cols-[3fr_1fr]">
        <div className="flex-center flex-col border-r">
          <h1 className="w-full px-5 py-3 text-left text-xl">
            {course.name} - {course.lessons[0].contents[0].name}
          </h1>
          <YoutubeIcon
            className="size-44 flex-1 text-muted-foreground"
            strokeWidth={1}
          />
        </div>

        <div className="">
          <h1 className="px-5 py-3 text-xl text-muted-foreground">Lições</h1>
          <LessonsAccordion lessons={course.lessons} />
        </div>
      </div>
    </div>
  );
}
