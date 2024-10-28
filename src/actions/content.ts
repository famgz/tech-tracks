"use server";

import { db } from "@/lib/prisma";

export async function getTrackById(trackId: string) {
  return db.track.findUnique({ where: { id: trackId } });
}

export async function getTrackWithModulesAndCourses(slug: string) {
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
