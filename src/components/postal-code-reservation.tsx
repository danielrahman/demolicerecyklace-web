"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { CONTACT } from "@/lib/site-config";
import { isSupportedPostalCode } from "@/lib/service-area";
import { ui } from "@/lib/ui";

const QUICK_POSTAL_CODES = ["10000", "11000", "16000", "25001", "25262", "27201"] as const;

export function PostalCodeReservation() {
  const router = useRouter();
  const [postalCode, setPostalCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  function goToReservation(code: string) {
    router.push(`/kontejnery/objednat?psc=${code}`);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = postalCode.replace(/\D/g, "").slice(0, 5);

    if (value.length !== 5) {
      setError("Zadejte PSČ v délce 5 číslic.");
      return;
    }

    if (!isSupportedPostalCode(value)) {
      setError("Toto PSČ zatím nepodporujeme online. Zavolejte dispečink pro individuální řešení.");
      return;
    }

    setError(null);
    goToReservation(value);
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          value={postalCode}
          onChange={(event) => {
            setPostalCode(event.target.value.replace(/\D/g, "").slice(0, 5));
            setError(null);
          }}
          inputMode="numeric"
          placeholder="Zadejte PSČ"
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-zinc-100 placeholder:text-zinc-500 sm:max-w-[220px]"
        />
        <button type="submit" className={ui.buttonPrimary}>
          Pokračovat do rezervace
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {QUICK_POSTAL_CODES.map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => goToReservation(code)}
            className={ui.buttonSecondary}
          >
            Rezervace pro {code}
          </button>
        ))}
      </div>

      {error ? <p className="rounded-xl bg-red-950/60 p-3 text-sm text-red-200">{error}</p> : null}

      <p className="text-sm text-zinc-400">
        Potřebujete rychlé ověření mimo online oblast? Volejte {" "}
        <a href={CONTACT.phoneHref} className="text-[var(--color-accent)]">
          {CONTACT.phone}
        </a>
        .
      </p>
    </div>
  );
}
