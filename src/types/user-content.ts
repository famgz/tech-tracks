import { Prisma } from "@prisma/client";

export type UserTrackWithUserModulesAndUserCourses =
  Prisma.UserTrackGetPayload<{
    include: {
      Track: {
        include: {
          modules: {
            include: {
              UserModule: true;
              courses: {
                include: {
                  Course: {
                    include: {
                      UserCourse: true;
                    };
                  };
                };
              };
            };
          };
        };
      };
    };
  }>;

export type ModuleWithUserModuleAndUserCourses = Prisma.ModuleGetPayload<{
  include: {
    UserModule: true;
    courses: {
      include: {
        Course: {
          include: {
            UserCourse: true;
          };
        };
      };
    };
  };
}>;
