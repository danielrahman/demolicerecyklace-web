"use client";

import { signOut } from "next-auth/react";

import { cx, ui } from "@/lib/ui";

export function AdminSignOutButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/admin/prihlaseni" })}
      className={cx(ui.buttonSecondary, className)}
    >
      Odhlásit
    </button>
  );
}
