import CourseCard from "@/app/courses/_components/course-card";
import Filters from "@/app/courses/_components/filters";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchIcon } from "lucide-react";

export default function CoursesPage() {
  return (
    <div className="_container flex flex-col py-2">
      <h1 className="py-2 text-center text-3xl font-bold">Courses</h1>

      <div className="flex flex-1 gap-4">
        {/* Filters column */}
        <div className="flex max-w-fit flex-col">
          <span className="mb-2">Filters</span>
          <div className="flex-center mb-4 gap-2 rounded-lg border px-2 py-1">
            <SearchIcon className="size-4 text-muted-foreground" />
            <input className="flex-1 bg-transparent outline-none" size={1} />
          </div>
          <ScrollArea className="-mr-2 h-[100px] flex-auto pr-4">
            <Filters />
          </ScrollArea>
        </div>

        {/* Cards column */}
        <div className="flex flex-1 flex-col">
          <span className="mb-2">191 courses</span>
          <ScrollArea className="-mr-2 h-[100px] flex-auto pr-4">
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 40 }).map((x, i) => (
                <HoverCard key={i}>
                  <HoverCardTrigger asChild>
                    <CourseCard />
                  </HoverCardTrigger>
                  <HoverCardContent className="" sideOffset={-50}>
                    <h3 className="text-sm font-bold">Course title</h3>
                    <span className="text-xs">
                      This is a very interesting tech course
                    </span>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
