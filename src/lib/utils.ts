import { CourseWithLessonsAndContents } from "@/types/content";
import { Content, Course } from "@prisma/client";
import { type ClassValue, clsx } from "clsx";
import { ReadonlyURLSearchParams } from "next/navigation";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isCourseOfTypeCourse(course: Course): boolean {
  return course.type === "course";
}

export function isContentVideo(content: Content): boolean {
  return content.type === "video";
}

export function openEnrollTrackDialog(
  pathname: string,
  searchParams: ReadonlyURLSearchParams,
) {
  const params = new URLSearchParams(searchParams.toString());
  params.set("enrollDialog", "open");
  window.history.replaceState({}, "", `${pathname}?${params.toString()}`);
}

export function closeEnrollTrackDialog(
  pathname: string,
  searchParams: ReadonlyURLSearchParams,
) {
  const params = new URLSearchParams(searchParams.toString());
  params.delete("enrollDialog");
  window.history.replaceState({}, "", `${pathname}?${params.toString()}`);
}

export function getVideoContent(course: CourseWithLessonsAndContents, contentId: string): Content | undefined {
  for (const lesson of course!.lessons) {
    for (const content of lesson.contents) {
      if (content.id === contentId && isContentVideo(content)) {
        return content;
      }
    }
  }
}