import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Home() {
  return (
    <div className="_container flex flex-col items-center py-10">
      <h1 className="py-4 text-3xl font-bold">Dio Courses</h1>
      <Link
        href="/courses"
        className={cn(
          buttonVariants({ variant: "default", size: "sm" }),
          "mx-auto",
        )}
      >
        Go to Courses
      </Link>
    </div>
  );
}
