"use server";

import { getSessionUserIdElseThrow } from "@/actions/auth";
import { USER_MAX_TRACK_SLOTS } from "@/constants/user";
import { db } from "@/lib/prisma";
import { UserTrackWithUserModulesAndUserCourses } from "@/types/user-content";
import { Content } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function isUserAllowedToEnroll(): Promise<boolean> {
  const userTracks = (await getAllUserTracksForUser()) || [];
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

export async function getAllUserTracksForUser() {
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

export async function getAllUserTracksForTrack(trackSlug: string) {
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

/**
 * Fetches all user modules and their courses for a specific track.
 * @param trackId - The ID of the track.
 * @returns User modules and their associated user courses.
 */
export async function getUserTrackWithUserModulesAndUserCourses(
  trackId: string,
): Promise<UserTrackWithUserModulesAndUserCourses | null> {
  try {
    const userId = await getSessionUserIdElseThrow();
    const res = await db.userTrack.findUnique({
      where: {
        userId_trackId: {
          userId,
          trackId,
        },
      },
      include: {
        Track: {
          include: {
            modules: {
              include: {
                UserModule: {
                  where: { userId },
                },
                courses: {
                  include: {
                    Course: {
                      include: {
                        UserCourse: {
                          where: { userId },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
    return res;
  } catch (e) {
    console.error(
      "Error fetching user track with user modules and user courses:",
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
    const userId_trackId = { userId, trackId };
    const current = await db.userTrack.findUnique({
      where: { userId_trackId },
    });
    // prevent bookmarkedAt overwriting
    if (current?.isEnrolled) {
      return;
    }
    const res = await db.userTrack.upsert({
      where: { userId_trackId },
      update: {
        isEnrolled: true,
        enrolledAt: new Date(),
      },
      create: {
        userId,
        trackId,
        isEnrolled: true,
        enrolledAt: new Date(),
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
    const res = await db.userTrack.upsert({
      where: { userId_trackId: { userId, trackId } },
      update: {
        isEnrolled: false,
      },
      create: {
        userId,
        trackId,
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
    const userId_trackId = { userId, trackId };
    const current = await db.userTrack.findUnique({
      where: { userId_trackId },
    });
    // prevent bookmarkedAt overwriting
    if (current?.isBookmarked) {
      return;
    }
    const res = await db.userTrack.upsert({
      where: { userId_trackId },
      update: {
        isBookmarked: true,
        bookmarkedAt: new Date(),
      },
      create: {
        userId,
        trackId,
        isBookmarked: true,
        bookmarkedAt: new Date(),
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
    const res = await db.userTrack.upsert({
      where: { userId_trackId: { userId, trackId } },
      update: {
        isBookmarked: false,
      },
      create: {
        userId,
        trackId,
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
  feedback: { comment: string; rating: number | null; liked: boolean },
) {
  try {
    const userId = await getSessionUserIdElseThrow();
    const userId_trackId = { userId, trackId };
    if (feedback.comment && feedback.comment?.length < 5) {
      throw new Error("Comment is too short");
    }
    const res = await db.userTrack.upsert({
      where: { userId_trackId },
      update: {
        comment: feedback.comment.trim() || null,
        rating: feedback.rating,
        liked: feedback.liked,
        feedbackedAt: new Date(),
      },
      create: {
        userId,
        trackId,
        comment: feedback.comment.trim() || null,
        rating: feedback.rating,
        liked: feedback.liked,
        feedbackedAt: new Date(),
      },
    });
    revalidatePath("/track/[slug]", "page");
    return res;
  } catch (e) {
    console.error("Failed to send user track feedback:", e);
    return null;
  }
}

export async function feedbackUserCourse(
  courseId: string,
  feedback: { comment: string; rating: number | null; liked: boolean },
) {
  try {
    const userId = await getSessionUserIdElseThrow();
    const userId_courseId = { userId, courseId };
    if (feedback.comment && feedback.comment?.length < 5) {
      throw new Error("Comment is too short");
    }
    const res = await db.userCourse.upsert({
      where: { userId_courseId },
      update: {
        comment: feedback.comment.trim() || null,
        rating: feedback.rating,
        liked: feedback.liked,
        feedbackedAt: new Date(),
      },
      create: {
        userId,
        courseId,
        comment: feedback.comment.trim() || null,
        rating: feedback.rating,
        liked: feedback.liked,
        feedbackedAt: new Date(),
      },
    });
    revalidatePath("/track/[slug]", "page");
    return res;
  } catch (e) {
    console.error("Failed to send user course feedback:", e);
    return null;
  }
}

export async function enrollModule(moduleId: string) {
  try {
    const userId = await getSessionUserIdElseThrow();
    const res = await db.userModule.upsert({
      where: { userId_moduleId: { userId, moduleId } },
      update: {},
      create: {
        userId,
        moduleId,
      },
    });
    revalidatePath("/track/[slug]", "page");
    revalidatePath("/user");
    return res;
  } catch (e) {
    console.error("Failed to enroll module:", e);
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

export async function enrollCourse(courseId: string) {
  try {
    const userId = await getSessionUserIdElseThrow();
    const userId_courseId = { userId, courseId };
    const current = await db.userCourse.findUnique({
      where: { userId_courseId },
    });
    // prevent enrolledAt overwriting
    if (current?.isEnrolled) {
      return;
    }
    const res = await db.userCourse.upsert({
      where: { userId_courseId },
      update: {
        isEnrolled: true,
        enrolledAt: new Date(),
      },
      create: {
        userId,
        courseId,
        isEnrolled: true,
        enrolledAt: new Date(),
      },
    });
    revalidatePath("/track/[slug]", "page");
    revalidatePath("/user");
    return res;
  } catch (e) {
    console.error("Failed to enroll course:", e);
    return null;
  }
}

export async function touchUserLesson(lessonId: string) {
  try {
    const userId = await getSessionUserIdElseThrow();
    const res = await db.userLesson.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: {},
      create: {
        userId,
        lessonId,
      },
    });
    revalidatePath("/course/[slug]", "page");
    return res;
  } catch (e) {
    console.error("Failed to enroll lesson:", e);
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
    const userId_contentId = { userId, contentId };
    const current = await db.userContent.findUnique({
      where: { userId_contentId },
    });
    if (current?.isCompleted) {
      return;
    }
    const res = await db.userContent.upsert({
      where: { userId_contentId },
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

// TODO: option to mark all lesson's content as watched

export async function computeUserLessonProgress(lessonId: string) {
  try {
    const userId = await getSessionUserIdElseThrow();
    const userId_lessonId = { userId, lessonId };
    const current = await db.userLesson.findUnique({
      where: { userId_lessonId },
    });

    if (current?.isCompleted) {
      return;
    }

    const [totalContentsCompleted, totalContentsForLesson] =
      await db.$transaction([
        db.userContent.count({
          where: {
            userId,
            Content: {
              lessonId,
            },
            isCompleted: true,
          },
        }),
        db.content.count({
          where: {
            lessonId,
            type: "video",
          },
        }),
      ]);

    const lessonIsCompleted = totalContentsCompleted >= totalContentsForLesson;

    await db.userLesson.upsert({
      where: { userId_lessonId },
      update: {
        totalContentsCompleted,
        isCompleted: lessonIsCompleted,
        completedAt: lessonIsCompleted ? new Date() : null,
      },
      create: {
        userId,
        lessonId,
        totalContentsCompleted,
        isCompleted: lessonIsCompleted,
        completedAt: lessonIsCompleted ? new Date() : null,
      },
    });
  } catch (e) {
    console.log("Error computing user lesson progress:", e);
  }
}

export async function computeUserCourseProgress(courseId: string) {
  try {
    const userId = await getSessionUserIdElseThrow();
    const userId_courseId = { userId, courseId };
    const current = await db.userCourse.findUnique({
      where: { userId_courseId },
    });

    if (current?.isCompleted) {
      return;
    }

    const [totalLessonsCompleted, totalLessonsForCourse] =
      await db.$transaction([
        db.userLesson.count({
          where: {
            userId,
            lesson: {
              courseId,
            },
            isCompleted: true,
          },
        }),
        db.lesson.count({
          where: {
            courseId,
            contents: { some: { type: "video" } },
          },
        }),
      ]);

    const courseIsCompleted = totalLessonsCompleted >= totalLessonsForCourse;

    await db.userCourse.upsert({
      where: {
        userId_courseId,
      },
      update: {
        totalLessonsCompleted,
        isCompleted: courseIsCompleted,
        completedAt: courseIsCompleted ? new Date() : null,
      },
      create: {
        userId,
        courseId,
        totalLessonsCompleted,
        isCompleted: courseIsCompleted,
        completedAt: courseIsCompleted ? new Date() : null,
      },
    });
  } catch (e) {
    console.log("Error computing user course progress:", e);
  }
}

export async function computeUserModuleProgress(moduleId: string) {
  try {
    const userId = await getSessionUserIdElseThrow();
    const userId_moduleId = { userId, moduleId };
    const current = await db.userModule.findUnique({
      where: {
        userId_moduleId,
      },
    });

    if (current?.isCompleted) {
      return;
    }

    const [totalCoursesCompleted, totalCoursesForModule] =
      await db.$transaction([
        db.userCourse.count({
          where: {
            userId,
            Course: {
              modules: {
                some: {
                  moduleId,
                },
              },
            },
            isCompleted: true,
          },
        }),
        db.course.count({
          where: {
            modules: {
              some: {
                moduleId,
              },
            },
            type: "course",
          },
        }),
      ]);

    const moduleIsCompleted = totalCoursesCompleted >= totalCoursesForModule;

    await db.userModule.upsert({
      where: {
        userId_moduleId,
      },
      update: {
        totalCoursesCompleted,
        isCompleted: moduleIsCompleted,
        completedAt: moduleIsCompleted ? new Date() : null,
      },
      create: {
        userId,
        moduleId,
        totalCoursesCompleted,
        isCompleted: moduleIsCompleted,
        completedAt: moduleIsCompleted ? new Date() : null,
      },
    });
  } catch (e) {
    console.log("Error computing user module progress:", e);
  }
}

export async function computeUserTrackProgress(trackId: string) {
  try {
    const userId = await getSessionUserIdElseThrow();
    const userId_trackId = { userId, trackId };
    const current = await db.userTrack.findUnique({
      where: { userId_trackId },
    });

    if (current?.isCompleted) {
      return;
    }

    const [totalCoursesCompleted, totalCoursesForTrack] = await db.$transaction(
      [
        db.userCourse.count({
          where: {
            userId,
            Course: {
              modules: {
                some: {
                  Module: { trackId },
                },
              },
            },
            isCompleted: true,
          },
        }),
        db.course.count({
          where: {
            modules: {
              some: {
                Module: { trackId },
              },
            },
            type: "course",
          },
        }),
      ],
    );

    const trackIsCompleted = totalCoursesCompleted >= totalCoursesForTrack;

    await db.userTrack.upsert({
      where: { userId_trackId },
      update: {
        totalCoursesCompleted,
        isCompleted: trackIsCompleted,
        completedAt: trackIsCompleted ? new Date() : null,
      },
      create: {
        userId,
        trackId,
        totalCoursesCompleted,
        isCompleted: trackIsCompleted,
        completedAt: trackIsCompleted ? new Date() : null,
      },
    });
  } catch (e) {
    console.log("Error computing user track progress:", e);
  }
}

export async function computeCascadeProgressFromContent(
  content: Content,
): Promise<boolean | null> {
  try {
    const userId = await getSessionUserIdElseThrow();

    const userContent = await db.userContent.findUnique({
      where: {
        userId_contentId: {
          userId,
          contentId: content.id,
        },
      },
      include: {
        Content: {
          include: {
            Lesson: {
              include: {
                Course: {
                  include: {
                    modules: {
                      include: {
                        Module: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!userContent?.Content?.Lesson?.Course) {
      throw new Error("Content, Lesson, or Course not found.");
    }

    const { Content } = userContent;
    const { Lesson } = Content;
    const { Course } = Lesson!;
    const { modules } = Course!;

    await computeUserLessonProgress(Lesson!.id);
    await computeUserCourseProgress(Course!.id);

    await Promise.all(
      modules.map(async (_module) => {
        await computeUserModuleProgress(_module.moduleId);
        await computeUserTrackProgress(_module.Module.trackId!);
      }),
    );

    return true;
  } catch (e) {
    console.error("Failed to compute progress:", e);
    return null;
  }
}
