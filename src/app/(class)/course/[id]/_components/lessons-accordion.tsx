import ContentCard from "@/app/(class)/course/[id]/_components/content-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LessonWithContents } from "@/types/content";

interface Props {
  lessons: LessonWithContents[];
  activeLessonId?: string;
  userId: string;
}

export default function LessonsAccordion({
  lessons,
  activeLessonId,
  userId,
}: Props) {
  return (
    <div>
      <Accordion
        type="single"
        className=""
        collapsible={true}
        defaultValue={activeLessonId}
      >
        {lessons.map((lesson) => (
          <AccordionItem
            key={lesson.id}
            value={lesson.id}
            className="border-muted-foreground/20"
          >
            <AccordionTrigger className="bg-muted text-left text-sm">
              {lesson.name}
            </AccordionTrigger>
            <AccordionContent className="bg-muted/50 p-2">
              <div className="border border-b-0 p-0">
                {lesson.contents.map((content) => (
                  <ContentCard
                    content={content}
                    key={content.id}
                    userId={userId}
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
