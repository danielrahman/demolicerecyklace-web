import type { DefaultSession } from "next-auth";
import type { JWT as DefaultJwt } from "next-auth/jwt";

import type { AdminRole } from "@/lib/types";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: AdminRole;
    };
  }

  interface User {
    role: AdminRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJwt {
    role?: AdminRole;
  }
}
