import { redirect } from "next/navigation";

import { requireAdminPageSession } from "@/lib/auth/guards";

export default async function AdminIndexPage() {
  await requireAdminPageSession();
  redirect("/admin/objednavky");
}
