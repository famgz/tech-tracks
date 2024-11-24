"use client";

import CourseCard from "@/app/(site)/track/[slug]/_components/course-card";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { openEnrollTrackDialog } from "@/lib/utils";
import { ModuleWithCourses } from "@/types/content";
import { Track } from "@prisma/client";
import { Accordion } from "@radix-ui/react-accordion";
import { CircleIcon } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";

interface Props {
  modules: ModuleWithCourses[];
  track: Track;
  isLoggedIn: boolean;
  isEnrolled: boolean;
}

export default function ModulesAccordion({
  modules,
  track,
  isLoggedIn,
  isEnrolled,
}: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  return (
    <Accordion
      type="multiple"
      className="overflow-hidden rounded-xl border border-muted-foreground/20"
    >
      {modules.map((_module) => (
        <AccordionItem
          key={_module.id}
          value={_module.id}
          className="border-muted-foreground/20"
        >
          <AccordionTrigger className="gap-4 bg-muted p-4 max-lg:text-sm lg:p-6">
            <CircleIcon className="size-5 text-muted-foreground" />
            <div className="flex flex-1 gap-y-1 text-left max-lg:flex-col lg:gap-3">
              <p className="flex-1 text-muted-foreground">{_module.name}</p>
              <p>
                {_module.courses.length} atividade
                {_module.courses.length > 1 && "s"}
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-5 p-4">
            {_module.courses.map(({ Course }) => (
              <CourseCard
                course={Course}
                key={Course.id}
                track={track}
                isLoggedIn={isLoggedIn}
                isEnrolled={isEnrolled}
                openEnrollTrackDialog={() =>
                  openEnrollTrackDialog(pathname, searchParams)
                }
              />
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
