import { UserRole } from "@prisma/client";
import { User } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: User & {
      id: string;
      role: UserRole;
    };
  }
}

export type LoginProvider = "google" | "github";

export interface SessionUser extends User {
  id: string;
  role: UserRole;
}
