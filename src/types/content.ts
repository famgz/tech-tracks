import { Prisma } from "@prisma/client";

export type TrackWithExtraInfo = Prisma.TrackGetPayload<{
  include: {
    skills: true;
    corporate: true;
  };
}>;

export type LessonWithContents = Prisma.LessonGetPayload<{
  include: { contents: true };
}>;

export type ModuleWithCourses = Prisma.ModuleGetPayload<{
  include: {
    courses: {
      include: {
        Course: true;
      };
    };
  };
}>;
