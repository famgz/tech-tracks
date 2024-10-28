import { Prisma } from "@prisma/client";

export type TrackWithExtraInfo = Prisma.TrackGetPayload<{
  include: {
    skills: true;
    corporate: true;
    careers: true;
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

export interface IFilters {
  career: Prisma.CareerGetPayload<{ include: { _count: true } }>[];
  corporate: Prisma.CorporateGetPayload<{ include: { _count: true } }>[];
  level: { id: string; name: string }[];
  skill: Prisma.SkillGetPayload<{ include: { _count: true } }>[];
}

export type FilterKeys = keyof IFilters;
