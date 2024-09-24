import CourseCard from "@/app/(site)/track/[slug]/_components/course-card";
import { auth } from "@/auth";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ModuleWithCourses } from "@/types/content";
import { Accordion } from "@radix-ui/react-accordion";
import { CircleIcon } from "lucide-react";

interface Props {
  modules: ModuleWithCourses[];
}

export default async function ModulesAccordion({ modules }: Props) {
  const session = await auth();
  const user = session?.user;

  return (
    <Accordion
      type="multiple"
      className="overflow-hidden rounded-xl border border-muted-foreground/20"
    >
      {modules.map((module) => (
        <AccordionItem
          key={module.id}
          value={module.id}
          className="border-muted-foreground/20"
        >
          <AccordionTrigger className="gap-4 bg-muted p-4 max-lg:text-sm lg:p-6">
            <CircleIcon className="size-5 text-muted-foreground" />
            <div className="flex flex-1 gap-y-1 text-left max-lg:flex-col lg:gap-3">
              <p className="flex-1 text-muted-foreground">{module.name}</p>
              <p>{module.total_activities} atividades</p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-5 p-4">
            {module.courses.map((course) => (
              <CourseCard
                course={course}
                key={course.id}
                trackId={module.trackId}
                isLoggedIn={!!user}
              />
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
