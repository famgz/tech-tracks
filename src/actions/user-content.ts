"use server";

import { getSessionUserIdElseThrow } from "@/actions/auth";
import { USER_MAX_TRACK_SLOTS } from "@/constants/user";
import { db } from "@/lib/prisma";
import { UserTrackWithUserModulesAndUserCourses } from "@/types/user-content";
import { Content, UserTrack } from "@prisma/client";
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
  } catch (error) {
    console.error(
      "Error fetching user track with user modules and user courses:",
      error,
    );
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
    const res = await db.userCourse.upsert({
      where: { userId_courseId: { userId, courseId } },
      update: {},
      create: {
        userId,
        courseId,
        isEnrolled: true,
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

export async function enrollLesson(lessonId: string) {
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

export async function computeProgress(
  content: Content,
): Promise<boolean | null> {
  try {
    const userId = await getSessionUserIdElseThrow();

    // Step 1: Find the UserContent record for the given contentId
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
                    modules: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!userContent || !userContent.Content?.Lesson?.Course) {
      throw new Error("Content, Lesson, or Course not found.");
    }

    const { Content } = userContent;
    const { Lesson } = Content;
    const { Course } = Lesson!;
    const { modules } = Course!;

    // Step 2: Compute UserLesson progress
    const userLesson = await db.userLesson.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId: Lesson!.id,
        },
      },
      update: {},
      create: {
        userId,
        lessonId: Lesson!.id,
      },
    });

    if (!userLesson) {
      throw new Error("UserLesson not found.");
    }

    const totalContentsCompleted = await db.userContent.count({
      where: {
        userId,
        Content: {
          lessonId: Lesson!.id,
        },
        isCompleted: true,
      },
    });

    const lessonIsCompleted =
      totalContentsCompleted >=
      (await db.content.count({
        where: {
          AND: [
            {
              lessonId: Lesson!.id,
            },
            { type: "video" },
          ],
        },
      }));

    // Update UserLesson
    await db.userLesson.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId: Lesson!.id,
        },
      },
      update: {
        totalContentsCompleted,
        isCompleted: lessonIsCompleted,
        completedAt: lessonIsCompleted ? new Date() : null,
      },
      create: {
        userId,
        lessonId: Lesson!.id,
        totalContentsCompleted,
        isCompleted: lessonIsCompleted,
        completedAt: lessonIsCompleted ? new Date() : null,
      },
    });

    // Step 3: Compute UserCourse progress
    const userCourse = await db.userCourse.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: Course!.id,
        },
      },
    });

    if (!userCourse) {
      throw new Error("UserCourse not found.");
    }

    const totalLessonsCompleted = await db.userLesson.count({
      where: {
        userId,
        lesson: {
          courseId: Course!.id,
        },
        isCompleted: true,
      },
    });

    const courseIsCompleted =
      totalLessonsCompleted >=
      (await db.lesson.count({
        where: {
          AND: [
            { courseId: Course!.id },
            { contents: { some: { type: "video" } } },
          ],
        },
      }));

    // Update UserCourse
    await db.userCourse.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId: Course!.id,
        },
      },
      update: {
        totalLessonsCompleted,
        isCompleted: courseIsCompleted,
        completedAt: courseIsCompleted ? new Date() : null,
      },
      create: {
        userId,
        courseId: Course!.id,
        totalLessonsCompleted,
        isCompleted: courseIsCompleted,
        completedAt: courseIsCompleted ? new Date() : null,
      },
    });

    // Step 4: Compute UserModule progress
    for (const _module of modules) {
      const userModule = await db.userModule.findUnique({
        where: {
          userId_moduleId: {
            userId,
            moduleId: _module.moduleId,
          },
        },
      });

      if (!userModule) {
        throw new Error(
          `UserModule for moduleId ${_module.moduleId} not found.`,
        );
      }

      // Calculate the number of courses that include the module
      const totalCoursesForModule = await db.course.count({
        where: {
          AND: [
            {
              modules: {
                some: {
                  moduleId: _module.moduleId,
                },
              },
            },
            {
              type: "course",
            },
          ],
        },
      });

      const totalCompletedCoursesForModule = await db.userCourse.count({
        where: {
          userId,
          Course: {
            modules: {
              some: {
                moduleId: _module.moduleId,
              },
            },
          },
          isCompleted: true,
        },
      });

      const moduleIsCompleted =
        totalCompletedCoursesForModule >= totalCoursesForModule;

      // Update UserModule
      await db.userModule.upsert({
        where: {
          userId_moduleId: {
            userId,
            moduleId: _module.moduleId,
          },
        },
        update: {
          totalCoursesCompleted: totalCompletedCoursesForModule,
          isCompleted: moduleIsCompleted,
          completedAt: moduleIsCompleted ? new Date() : null,
        },
        create: {
          userId,
          moduleId: _module!.moduleId,
          totalCoursesCompleted: totalCompletedCoursesForModule,
          isCompleted: moduleIsCompleted,
          completedAt: moduleIsCompleted ? new Date() : null,
        },
      });
    }

    revalidatePath("/course/[id]", "page");
    revalidatePath("/track/[id]", "page");
    return true;
  } catch (e) {
    console.error("Failed to compute progress:", e);
    return null;
  }
}

export async function completeUserTrack(
  userTrack: UserTrack,
  totalCompleted: number,
) {
  if (!userTrack) return null;
  try {
    const res = await db.userTrack.update({
      where: {
        userId_trackId: {
          userId: userTrack.userId,
          trackId: userTrack.trackId,
        },
      },
      data: {
        totalCompleted,
        isCompleted: true,
        completedAt: new Date(),
      },
    });
    revalidatePath("/track/[slug]", "page");
    revalidatePath("/user");
    return await getUserTrackWithUserModulesAndUserCourses(userTrack.trackId);
  } catch (e) {
    console.error("Failed to complete user track:", e);
    return null;
  }
}
