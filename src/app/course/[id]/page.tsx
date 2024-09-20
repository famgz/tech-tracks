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
      <h1 className="px-5 py-3 text-xl">{course.name}</h1>

      <div className="grid h-full grid-cols-[3fr_1fr]">
        <div className="flex-center border-r">
          <YoutubeIcon
            className="size-44 text-muted-foreground"
            strokeWidth={1}
          />
        </div>

        <div className="">
          <LessonsAccordion lessons={course.lessons} />
        </div>
      </div>
    </div>
  );
}
