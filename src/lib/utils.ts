import { Content, Course } from "@prisma/client";
import { type ClassValue, clsx } from "clsx";
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
