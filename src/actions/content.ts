"use server";

import { db } from "@/lib/prisma";
import {
  CareerWithCount,
  CorporateWithCount,
  CourseWithLessonsAndContents,
  SkillWithCount,
  TrackWithWithModulesCoursesAndExtras,
} from "@/types/content";

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
  }
}

export async function getTrackWithModulesAndCourses(
  slug: string,
): Promise<TrackWithWithModulesCoursesAndExtras | undefined | null> {
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
  }
}

export async function getCourseWithLessonsAndContents(
  courseId: string,
): Promise<CourseWithLessonsAndContents | undefined | null> {
  try {
    const res = await db.course.findUnique({
      where: { id: courseId },
      include: { lessons: { include: { contents: true } } },
    });
    return res;
  } catch (e) {
    console.error("Failed to get course with lessons and contents:", e);
  }
}

export async function getCareersWithCount(): Promise<
  CareerWithCount[] | undefined
> {
  try {
    const res = await db.career.findMany({
      orderBy: { name: "asc" },
      include: { _count: true },
    });
    return res;
  } catch (e) {
    console.error("Failed to get careers with count:", e);
  }
}

export async function getCorporatesWithCount(): Promise<
  CorporateWithCount[] | undefined
> {
  try {
    const res = await db.corporate.findMany({
      orderBy: { name: "asc" },
      include: { _count: true },
    });
    return res;
  } catch (e) {
    console.error("Failed to get corporates with count:", e);
  }
}

export async function getSkillsWithCount(): Promise<
  SkillWithCount[] | undefined
> {
  try {
    const res = await db.skill.findMany({
      orderBy: { name: "asc" },
      include: { _count: true },
    });
    return res;
  } catch (e) {
    console.error("Failed to get skills with count:", e);
  }
}
