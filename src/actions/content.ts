"use server";

import { db } from "@/lib/prisma";
import {
  CareerWithCount,
  CorporateWithCount,
  CourseWithLessonsAndContents,
  SkillWithCount,
  TrackWithWithModulesCoursesAndExtras,
} from "@/types/content";
import { Content } from "@prisma/client";

export async function getTrackById(trackId: string) {
  return db.track.findUnique({ where: { id: trackId } });
}

export async function getTracksWithExtras() {
  try {
    const res = await db.track.findMany({
      include: { skills: true, corporate: true, careers: true },
      orderBy: { created: "desc" },
    });
    return res;
  } catch (e) {
    console.error("Failed to get track with extras:", e);
    return null;
  }
}

export async function getTrackWithModulesAndCourses(
  slug: string,
): Promise<TrackWithWithModulesCoursesAndExtras | null> {
  try {
    return await db.track.findUnique({
      where: {
        slug,
      },
      include: {
        careers: true,
        corporate: true,
        modules: {
          include: {
            courses: {
              include: {
                Course: true,
              },
              orderBy: { order: "asc" },
            },
          },
        },
        skills: true,
        track_activities: true,
      },
    });
  } catch (e) {
    console.error("Failed to get track with modules and courses:", e);
    return null;
  }
}

export async function getCourseWithLessonsAndContents(
  courseId: string,
): Promise<CourseWithLessonsAndContents | null> {
  try {
    const res = await db.course.findUnique({
      where: { id: courseId },
      include: {
        lessons: { orderBy: { order: "asc" }, include: { contents: true } },
      },
    });
    return res;
  } catch (e) {
    console.error("Failed to get course with lessons and contents:", e);
    return null;
  }
}

export async function getCareersWithCount(): Promise<CareerWithCount[] | null> {
  try {
    const res = await db.career.findMany({
      orderBy: { name: "asc" },
      include: { _count: true },
    });
    return res;
  } catch (e) {
    console.error("Failed to get careers with count:", e);
    return null;
  }
}

export async function getCorporatesWithCount(): Promise<
  CorporateWithCount[] | null
> {
  try {
    const res = await db.corporate.findMany({
      orderBy: { name: "asc" },
      include: { _count: true },
    });
    return res;
  } catch (e) {
    console.error("Failed to get corporates with count:", e);
    return null;
  }
}

export async function getSkillsWithCount(): Promise<SkillWithCount[] | null> {
  try {
    const res = await db.skill.findMany({
      orderBy: { name: "asc" },
      include: { _count: true },
    });
    return res;
  } catch (e) {
    console.error("Failed to get skills with count:", e);
    return null;
  }
}

export async function isCourseInTrack(
  trackId: string,
  courseId: string,
): Promise<boolean> {
  try {
    const res = await db.moduleCourse.findFirst({
      where: {
        courseId,
        Module: {
          trackId,
        },
      },
    });
    return !!res;
  } catch (e) {
    console.error("Failed to check if course is in track:", e);
    return false;
  }
}

export async function getVideoContentInCourse(
  contentId: string,
  courseId: string,
): Promise<Content | null> {
  try {
    const res = await db.content.findUnique({
      where: {
        type: "video",
        Lesson: {
          courseId,
        },
        id: contentId,
      },
    });
    return res;
  } catch (e) {
    console.error("Failed to get video content in course:", e);
    return null;
  }
}

export async function getFirstVideoContentInCourse(
  courseId: string,
): Promise<Content | null> {
  try {
    const res = await db.content.findFirst({
      where: {
        type: "video",
        Lesson: {
          courseId,
        },
      },
      orderBy: [
        {
          Lesson: {
            order: "asc",
          },
        },
      ],
    });
    return res;
  } catch (e) {
    console.error("Failed to get first video content in course:", e);
    return null;
  }
}
