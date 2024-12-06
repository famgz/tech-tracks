import { Prisma } from "@prisma/client";

export type TrackWithExtras = Prisma.TrackGetPayload<{
  include: {
    skills: true;
    corporate: true;
    careers: true;
  };
}>;

export type TrackWithModulesCoursesAndExtras = Prisma.TrackGetPayload<{
  include: {
    careers: true;
    corporate: true;
    skills: true;
    modules: {
      include: {
        courses: {
          include: {
            Course: true;
          };
        };
      };
    };
  };
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

export type CourseWithLessonsAndContents = Prisma.CourseGetPayload<{
  include: { lessons: { include: { contents: true } } };
}>;

export type LessonWithContents = Prisma.LessonGetPayload<{
  include: { contents: true };
}>;

export type CareerWithCount = Prisma.CareerGetPayload<{
  include: { _count: true };
}>;

export type CorporateWithCount = Prisma.CorporateGetPayload<{
  include: { _count: true };
}>;

export type SkillWithCount = Prisma.SkillGetPayload<{
  include: { _count: true };
}>;

export interface IFilters {
  career: CareerWithCount[];
  corporate: CorporateWithCount[];
  level: { id: string; name: string }[];
  skill: SkillWithCount[];
}

export type FilterKeys = keyof IFilters;
