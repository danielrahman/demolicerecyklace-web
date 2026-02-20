import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth/options";
import type { AdminRole } from "@/lib/types";

const allowedRoles = new Set<AdminRole>(["admin", "operator"]);

export async function requireAdminPageSession() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  if (!session?.user?.email) {
    redirect("/admin/prihlaseni");
  }

  if (!role || !allowedRoles.has(role)) {
    redirect("/admin/prihlaseni");
  }

  return session;
}

export async function requireAdminApiSession() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  if (!session?.user?.email) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Nepřihlášený uživatel" }, { status: 401 }),
    };
  }

  if (!role || !allowedRoles.has(role)) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Nemáte oprávnění" }, { status: 403 }),
    };
  }

  return {
    ok: true as const,
    session,
  };
}
