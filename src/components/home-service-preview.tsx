"use client";

import { type MouseEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { ui } from "@/lib/ui";

type HomeServiceCard = {
  title: string;
  subtitle: string;
  description: string;
  points: string[];
  href: string;
  cta: string;
  imageUrl: string;
  imageAlt: string;
};

type CursorImage = {
  service: HomeServiceCard;
  x: number;
  y: number;
};

const PREVIEW_WIDTH = 320;
const PREVIEW_ASPECT_RATIO = 1.65;
const PREVIEW_HEIGHT = Math.round(PREVIEW_WIDTH / PREVIEW_ASPECT_RATIO);

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function HomeServicePreview({ services }: { services: HomeServiceCard[] }) {
  const [preview, setPreview] = useState<CursorImage | null>(null);

  const updateCursor = (service: HomeServiceCard, event: MouseEvent<HTMLElement>) => {
    const x = clamp(event.clientX + 16, 16, window.innerWidth - PREVIEW_WIDTH - 16);
    const y = clamp(event.clientY + 16, 16, window.innerHeight - PREVIEW_HEIGHT - 16);
    setPreview({ service, x, y });
  };

  return (
    <>
      <div className="grid gap-7 md:grid-cols-3">
        {services.map((service) => (
          <article
            key={`${service.title}-${service.href}`}
            className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70 px-5 py-5 transition hover:border-[#F2C400]"
            onMouseMove={(event) => {
              updateCursor(service, event);
            }}
            onMouseEnter={(event) => {
              updateCursor(service, event);
            }}
            onMouseLeave={() => {
              setPreview(null);
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-[#F2C400]">{service.subtitle}</p>
            <h3 className="mt-1 text-2xl font-bold">{service.title}</h3>
            <p className="mt-3 text-zinc-300">{service.description}</p>
            <ul className="mt-4 space-y-1 text-sm text-zinc-300">
              {service.points.map((point) => (
                <li key={point}>- {point}</li>
              ))}
            </ul>
            <div className="mt-5">
              <Link href={service.href} className={ui.buttonInline}>
                {service.cta}
              </Link>
            </div>
          </article>
        ))}
      </div>

      {preview ? (
        <div
          className="pointer-events-none fixed z-40 hidden min-h-0 overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-950 shadow-2xl shadow-black/50 sm:block"
          style={{ left: preview.x, top: preview.y }}
        >
          <div className="relative h-52 w-80">
            <Image
              src={preview.service.imageUrl}
              alt={preview.service.imageAlt}
              width={1280}
              height={720}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
          </div>
          <div className="px-3 py-2">
            <p className="text-sm font-semibold text-zinc-100">{preview.service.title}</p>
          </div>
        </div>
      ) : null}
    </>
  );
}
