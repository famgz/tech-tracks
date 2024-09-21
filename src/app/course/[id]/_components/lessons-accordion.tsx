import PlayIcon from "@/components/icons/play";
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
            <AccordionTrigger className="text-left">
              {lesson.name}
            </AccordionTrigger>
            <AccordionContent className="bg-muted p-0">
              {lesson.contents.map((content, i) => (
                <div
                  key={content.id}
                  className="flex cursor-pointer items-center gap-3 border-b bg-background p-4 text-xs font-light hover:bg-background/70"
                >
                  <PlayIcon isFilled={i < 2} />

                  <p className="flex-1 text-left">{content.name}</p>

                  <span>{content.duration}</span>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
