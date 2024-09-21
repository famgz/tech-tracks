import { Prisma } from "@prisma/client";

export type LessonWithContents = Prisma.LessonGetPayload<{
  include: { contents: true };
}>;

export type ModuleWithCourses = Prisma.ModuleGetPayload<{
  include: { courses: true };
}>;
