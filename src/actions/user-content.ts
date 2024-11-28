"use server";

import { getSessionUserIdElseThrow } from "@/actions/auth";
import { USER_MAX_TRACK_SLOTS } from "@/constants/user";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function isUserAllowedToEnroll(): Promise<boolean> {
  const userTracks = (await getAllUserTracks()) || [];
  const enrolledUserTracks = userTracks.filter((t) => t.isEnrolled);
  return enrolledUserTracks.length < USER_MAX_TRACK_SLOTS;
}

export async function getUserTrack(trackId: string) {
  try {
    const userId = await getSessionUserIdElseThrow();
    const res = await db.userTrack.findUnique({
      where: { userId_trackId: { userId, trackId } },
    });
    return res;
  } catch (e) {
    console.error("Failed to get user track:", e);
    return null;
  }
}

export async function getAllUserTracks() {
  try {
    const userId = await getSessionUserIdElseThrow();
    const res = await db.userTrack.findMany({
      where: { userId },
      include: { Track: true },
    });
    return res;
  } catch (e) {
    console.error("Failed to get all user tracks:", e);
    return null;
  }
}

export async function getAllUserTracksInTrack(trackSlug: string) {
  try {
    const res = await db.userTrack.findMany({
      where: { Track: { slug: trackSlug } },
      include: { User: true },
    });
    return res;
  } catch (e) {
    console.error(
      `Failed to get all user tracks for trackSlug ${trackSlug}:`,
      e,
    );
    return null;
  }
}

export async function enrollTrack(trackId: string) {
  try {
    if (!isUserAllowedToEnroll()) {
      throw new Error("User has reached enrollment limit");
    }
    const userId = await getSessionUserIdElseThrow();
    const res = await db.userTrack.upsert({
      where: { userId_trackId: { userId, trackId } },
      update: {
        isEnrolled: true,
      },
      create: {
        userId,
        trackId,
        isEnrolled: true,
        isBookmarked: false,
      },
    });
    revalidatePath("/track/[slug]", "page");
    revalidatePath("/user");
    return res;
  } catch (e) {
    console.error("Failed to enroll track:", e);
    return null;
  }
}

export async function unenrollTrack(trackId: string) {
  try {
    const userId = await getSessionUserIdElseThrow();
    const res = await db.userTrack.update({
      where: { userId_trackId: { userId, trackId } },
      data: {
        isEnrolled: false,
      },
    });
    revalidatePath("/track/[slug]", "page");
    revalidatePath("/user");
    return res;
  } catch (e) {
    console.error("Failed to unenroll track:", e);
    return null;
  }
}

export async function bookmarkTrack(trackId: string) {
  try {
    const userId = await getSessionUserIdElseThrow();
    const res = await db.userTrack.upsert({
      where: { userId_trackId: { userId, trackId } },
      update: {
        isBookmarked: true,
      },
      create: {
        userId,
        trackId,
        isBookmarked: true,
      },
    });
    revalidatePath("/track/[slug]", "page");
    revalidatePath("/user");
    return res;
  } catch (e) {
    console.error("Failed to bookmark track:", e);
    return null;
  }
}

export async function unbookmarkTrack(trackId: string) {
  try {
    const userId = await getSessionUserIdElseThrow();
    const res = await db.userTrack.update({
      where: { userId_trackId: { userId, trackId } },
      data: {
        isBookmarked: false,
      },
    });
    revalidatePath("/track/[slug]", "page");
    revalidatePath("/user");
    return res;
  } catch (e) {
    console.error("Failed to unbookmark track:", e);
    return null;
  }
}

export async function feedbackUserTrack(
  trackId: string,
  feedback: { comment: string; rating: number; liked: boolean },
) {
  try {
    const userId = await getSessionUserIdElseThrow();
    if (feedback.comment && feedback.comment?.length < 5) {
      throw new Error("Comment is too short");
    }
    const res = await db.userTrack.update({
      where: { userId_trackId: { userId, trackId } },
      data: {
        comment: feedback.comment.trim() || null,
        rating: feedback.rating || null,
        liked: feedback.liked ?? null,
      },
    });
    revalidatePath("/track/[slug]", "page");
    return res;
  } catch (e) {
    console.error("Failed to send user track feedback:", e);
    return null;
  }
}

export async function getUserCourse(courseId: string) {
  try {
    const userId = await getSessionUserIdElseThrow();
    const res = await db.userCourse.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    return res;
  } catch (e) {
    console.error("Failed to get user course:", e);
    return null;
  }
}

export async function getUserContent(contentId: string) {
  try {
    const userId = await getSessionUserIdElseThrow();
    const res = await db.userContent.findUnique({
      where: { userId_contentId: { userId, contentId } },
    });
    return res;
  } catch (e) {
    console.error("Failed to get user content:", e);
    return null;
  }
}

export async function getAllUserContentsInCourse(courseId: string) {
  try {
    const userId = await getSessionUserIdElseThrow();
    const res = await db.userContent.findMany({
      where: { userId, Content: { Lesson: { courseId } } },
    });
    return res;
  } catch (e) {
    console.error("Failed to get all user contents in course:", e);
    return null;
  }
}

export async function watchUserContent(contentId: string) {
  try {
    const userId = await getSessionUserIdElseThrow();
    const res = await db.userContent.upsert({
      where: { userId_contentId: { userId, contentId } },
      update: {
        isCompleted: true,
        completedAt: new Date(),
      },
      create: {
        userId,
        contentId,
        isCompleted: true,
        completedAt: new Date(),
      },
    });
    revalidatePath("/course/[id]", "page");
    return res;
  } catch (e) {
    console.error("Failed to mark user content as watched:", e);
    return null;
  }
}

export async function unwatchUserContent(contentId: string) {
  try {
    const userId = await getSessionUserIdElseThrow();
    const res = await db.userContent.upsert({
      where: { userId_contentId: { userId, contentId } },
      update: {
        isCompleted: false,
        completedAt: null,
      },
      create: {
        userId,
        contentId,
        isCompleted: false,
      },
    });
    revalidatePath("/course/[id]", "page");
    return res;
  } catch (e) {
    console.error("Failed to mark user content as unwatched:", e);
    return null;
  }
}
