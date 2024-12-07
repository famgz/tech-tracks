import {
  CourseWithLessonsAndContents,
  TrackWithModulesCoursesAndExtras,
} from "@/types/content";
import {
  ModuleWithUserModuleAndUserCourses,
  UserTrackWithUserModulesAndUserCourses,
} from "@/types/user-content";
import { Content, Course, Track, UserCourse, UserModule } from "@prisma/client";
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

export function getVideoContentByIdFromCourse(
  course: CourseWithLessonsAndContents,
  contentId: string,
): Content | undefined {
  if (!contentId) return;

  for (const lesson of course.lessons) {
    for (const content of lesson.contents) {
      if (content.id === contentId && isContentVideo(content)) {
        return content;
      }
    }
  }
}

export function getFirstVideoContentFromCourse(
  course: CourseWithLessonsAndContents,
): Content | undefined {
  for (const lesson of course.lessons) {
    for (const content of lesson.contents) {
      if (isContentVideo(content)) {
        return content;
      }
    }
  }
}

export function getTrackCourseQuantity(
  track: TrackWithModulesCoursesAndExtras | null,
) {
  let totalCourses = 0;
  if (!track) {
    return totalCourses;
  }
  for (const _module of track.modules) {
    const videoCourses = _module.courses.filter((x) =>
      isCourseOfTypeCourse(x.Course),
    );
    totalCourses += videoCourses.length;
  }
  return totalCourses;
}

export function getModuleInUserTrack(
  userTrack: UserTrackWithUserModulesAndUserCourses | null,
  moduleId: string,
): ModuleWithUserModuleAndUserCourses | null {
  const _module =
    userTrack?.Track?.modules &&
    userTrack.Track.modules.find((x) => x.id === moduleId);
  return _module || null;
}

export function getUserCourseInModule(
  _module: ModuleWithUserModuleAndUserCourses | null,
  courseId: string,
): UserCourse | null {
  const course =
    _module?.courses && _module.courses.find((x) => x.courseId === courseId);
  if (!course) {
    return null;
  }
  const userCourse = course.Course.UserCourse.find(
    (x) => x.courseId === courseId,
  );
  return userCourse || null;
}

export function getCompletedCoursesInTrack(
  userTrack: UserTrackWithUserModulesAndUserCourses | null,
): number {
  let total = 0;
  const modules = userTrack?.Track.modules;
  if (!modules) {
    return total;
  }
  for (const _module of modules) {
    for (const course of _module.courses) {
      const completed = course.Course.UserCourse.reduce(
        (acc, uc) => (uc.isCompleted ? acc + 1 : acc),
        0,
      );
      total += completed;
    }
  }
  return total;
}
