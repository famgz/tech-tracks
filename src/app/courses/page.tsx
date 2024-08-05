import CourseCard from "@/app/courses/_components/course-card";
import Filters from "@/app/courses/_components/filters";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CoursesPage() {
  return (
    <div className="_container flex flex-col py-2">
      <h1 className="py-2 text-center text-3xl font-bold">Courses</h1>

      <div className="flex flex-1">
        {/* Filters column */}
        <div className="flex flex-col px-4">
          <span className="mb-2">Filters</span>
          <ScrollArea className="-mr-2 h-[100px] flex-auto pr-4">
            <Filters />
          </ScrollArea>
        </div>

        {/* Cards column */}
        <div className="flex flex-1 flex-col px-4">
          <span className="mb-2">191 courses</span>
          <ScrollArea className="-mr-2 h-[100px] flex-auto pr-4">
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
