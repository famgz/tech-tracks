import ContentCard from "@/app/course/[id]/_components/content-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LessonWithContents } from "@/types/content";

interface Props {
  lessons: LessonWithContents[];
}

export default function LessonsAccordion({ lessons }: Props) {
  return (
    <div>
      <Accordion type="multiple" className="bg-muted">
        {lessons.map((lesson) => (
          <AccordionItem
            key={lesson.id}
            value={lesson.id}
            className="border-muted-foreground/20"
          >
            <AccordionTrigger className="text-left text-sm">
              {lesson.name}
            </AccordionTrigger>
            <AccordionContent className="bg-muted p-0">
              {lesson.contents.map((content) => (
                <ContentCard content={content} key={content.id} />
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
