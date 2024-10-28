"use server";

import { USER_MAX_TRACK_SLOTS } from "@/constants/user";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function isUserAllowedToEnroll(userId: string): Promise<Boolean> {
  const userTracks = (await getAllUserTracks(userId)) || [];
  const enrolledUserTracks = userTracks.filter((t) => t.isEnrolled);
  console.log({ enrolledUserTracks });
  return !!(
    enrolledUserTracks && enrolledUserTracks.length < USER_MAX_TRACK_SLOTS
  );
}

export async function getUserTrack(userId: string, trackId: string) {
  try {
    const res = await db.userTrack.findUnique({
      where: { userId_trackId: { userId, trackId } },
    });
    return res;
  } catch (e) {
    console.error("Failed to get user track:", e);
  }
}

export async function getAllUserTracks(userId: string) {
  try {
    const res = await db.userTrack.findMany({
      where: { userId },
      include: { Track: true },
    });
    return res;
  } catch (e) {
    console.error("Failed to get user tracks:", e);
  }
}

export async function enrollTrack(userId: string, trackId: string) {
  try {
    if (!isUserAllowedToEnroll(userId)) {
      throw new Error("User has reached enrollment limit");
    }
    const res = await db.userTrack.upsert({
      where: { userId_trackId: { userId, trackId } },
      update: {
        isEnrolled: true,
      },
      create: {
        userId,
        trackId,
        isEnrolled: true,
      },
    });
    revalidatePath("/track/[slug]", "page");
    return res;
  } catch (e) {
    console.error("Failed to enroll track:", e);
  }
}

export async function unenrollTrack(userId: string, trackId: string) {
  try {
    const res = await db.userTrack.update({
      where: { userId_trackId: { userId, trackId } },
      data: {
        isEnrolled: false,
      },
    });
    revalidatePath("/track/[slug]", "page");
    revalidatePath("/user", "page");
    return res;
  } catch (e) {
    console.error("Failed to unenroll track:", e);
  }
}

export async function bookmarkTrack(userId: string, trackId: string) {
  try {
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
    return res;
  } catch (e) {
    console.error("Failed to bookmark track:", e);
  }
}

export async function unbookmarkTrack(userId: string, trackId: string) {
  try {
    const res = await db.userTrack.update({
      where: { userId_trackId: { userId, trackId } },
      data: {
        isBookmarked: false,
      },
    });
    revalidatePath("/track/[slug]", "page");
    revalidatePath("/user", "page");
    return res;
  } catch (e) {
    console.error("Failed to unbookmark track:", e);
  }
}
