import { Prisma } from "@prisma/client";
export type LessonWithContent = Prisma.LessonGetPayload<{
  include: { contents: true };
}>;
