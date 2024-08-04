import Filters from "@/app/courses/_components/filters";
import CourseCard from "@/components/course-card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CoursesPage() {
  return (
    <div className="_container flex flex-col py-2">
      <h1 className="py-2 text-center text-3xl font-bold">Courses</h1>

      <div className="flex flex-1">
        <div className="flex flex-col px-4">
          <span className="mb-2">Filters</span>
          <ScrollArea className="-mr-2 h-[100px] flex-auto pr-4">
            <Filters />
          </ScrollArea>
        </div>

        <div className="flex flex-1 flex-col px-4">
          <span className="mb-2">191 courses</span>
          <ScrollArea className="-mr-2 h-[100px] flex-auto pr-4">
            <div className="flex flex-wrap justify-center gap-4">
              {Array.from({ length: 40 }).map((x, i) => (
                <CourseCard key={i} />
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
