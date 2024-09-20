import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LessonWithContent } from "@/types/content";

interface Props {
  lessons: LessonWithContent[];
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
            <AccordionTrigger>{lesson.name}</AccordionTrigger>
            <AccordionContent className="space-y-3 bg-background p-3">
              {lesson.contents.map((content) => (
                <p
                  className="bg-muted p-4 text-muted-foreground"
                  key={content.id}
                >
                  {content.name}
                </p>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
