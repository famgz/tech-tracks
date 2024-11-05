import ContentCard from "@/app/(class)/course/[id]/_components/content-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { LessonWithContents } from "@/types/content";
import { UserContent } from "@prisma/client";

interface Props {
  lessons: LessonWithContents[];
  currentLessonId: string | undefined;
  currentContentId: string | undefined;
  userId: string;
  userContentsInCourse: UserContent[];
}

export default function LessonsAccordion({
  lessons,
  currentLessonId,
  currentContentId,
  userContentsInCourse,
  userId,
}: Props) {
  return (
    <div>
      <Accordion
        type="single"
        className=""
        collapsible={true}
        defaultValue={currentLessonId}
      >
        {lessons.map((lesson) => (
          <AccordionItem
            key={lesson.id}
            value={lesson.id}
            className="border-muted-foreground/20"
          >
            <AccordionTrigger className="bg-muted text-left text-sm">
              <span
                className={cn({
                  "text-primary/90": lesson.id === currentLessonId,
                })}
              >
                {lesson.name}
              </span>
            </AccordionTrigger>
            <AccordionContent className="bg-muted/50 p-2">
              <div className="border border-b-0 p-0">
                {lesson.contents.map((content) => (
                  <ContentCard
                    key={content.id}
                    content={content}
                    userId={userId}
                    currentContentId={currentContentId}
                    userContentInCourse={userContentsInCourse.find(
                      (x) => x.contentId === content.id,
                    )}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
