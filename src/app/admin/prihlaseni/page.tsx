"use client";

import { FormEvent, Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

import { ui } from "@/lib/ui";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin/objednavky";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl,
    });

    if (!result || result.error) {
      setError("Přihlášení se nepodařilo. Zkontrolujte e-mail a heslo.");
      setSubmitting(false);
      return;
    }

    router.push(result.url || callbackUrl);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-lg space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h1 className="text-3xl font-bold">Přihlášení do administrace</h1>
      <p className="text-zinc-300">Přihlaste se účtem operátora nebo administrátora.</p>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-2">
          E-mail
          <input
            className="rounded-md border border-zinc-700 bg-zinc-950 p-2"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label className="flex flex-col gap-2">
          Heslo
          <input
            className="rounded-md border border-zinc-700 bg-zinc-950 p-2"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        {error ? (
          <p role="alert" className="rounded-md border border-red-600 bg-red-950/30 px-3 py-2 text-sm text-red-200">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          className={ui.buttonPrimary}
          disabled={submitting}
        >
          {submitting ? "Přihlašuji..." : "Přihlásit"}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-lg rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-300">Načítám přihlášení...</div>}>
      <AdminLoginForm />
    </Suspense>
  );
}
