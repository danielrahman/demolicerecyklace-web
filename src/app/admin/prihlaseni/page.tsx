import Link from "next/link";

import { ui } from "@/lib/ui";

export default function AdminLoginPage() {
  return (
    <div className="mx-auto max-w-lg space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h1 className="text-3xl font-bold">Admin přihlášení</h1>
      <p className="text-zinc-300">MVP: jednoduché přihlášení, bez dashboardu a bez grafů.</p>
      <form className="space-y-3">
        <label className="flex flex-col gap-2">
          E-mail
          <input className="rounded-md border border-zinc-700 bg-zinc-950 p-2" type="email" />
        </label>
        <label className="flex flex-col gap-2">
          Heslo
          <input className="rounded-md border border-zinc-700 bg-zinc-950 p-2" type="password" />
        </label>
        <button
          type="button"
          className={ui.buttonPrimary}
        >
          Přihlásit
        </button>
      </form>
      <Link href="/admin/objednavky" className="text-sm text-zinc-400 underline">
        Pokračovat na seznam objednávek (MVP prototyp)
      </Link>
    </div>
  );
}
