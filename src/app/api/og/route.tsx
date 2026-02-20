import { ImageResponse } from "next/og";

import { SITE_META } from "@/lib/site-config";

export const runtime = "edge";

const IMAGE_WIDTH = 1200;
const IMAGE_HEIGHT = 630;
const MAX_TITLE_LENGTH = 80;
const MAX_SUBTITLE_LENGTH = 140;
const LOGO_WIDTH = 290;
const LOGO_HEIGHT = 78;

function trimValue(value: string | null, maxLength: number, fallback: string) {
  const normalized = value?.trim().replace(/\s+/g, " ") ?? "";
  if (!normalized) return fallback;
  return normalized.slice(0, maxLength);
}

function toBase64(buffer: ArrayBuffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = trimValue(
    searchParams.get("title"),
    MAX_TITLE_LENGTH,
    SITE_META.brandName,
  );
  const subtitle = trimValue(
    searchParams.get("subtitle"),
    MAX_SUBTITLE_LENGTH,
    "Demolice, kontejnery, odvoz suti a recyklace",
  );
  let logoDataUrl: string | null = null;

  try {
    const logoUrl = new URL("/brand/logo-original.png", request.url);
    const logoResponse = await fetch(logoUrl.toString(), { cache: "force-cache" });
    if (logoResponse.ok) {
      const logoBuffer = await logoResponse.arrayBuffer();
      logoDataUrl = `data:image/png;base64,${toBase64(logoBuffer)}`;
    }
  } catch {
    logoDataUrl = null;
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "52px 58px",
          color: "#ffffff",
          background:
            "radial-gradient(circle at 10% 20%, #3f3f46 0%, #18181b 55%, #09090b 100%)",
          fontFamily: "Arial, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "-100px",
            top: "-120px",
            width: "420px",
            height: "420px",
            borderRadius: "999px",
            background: "rgba(242, 196, 0, 0.15)",
            filter: "blur(20px)",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "18px", zIndex: 1 }}>
          {logoDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- ImageResponse renderer does not support next/image.
            <img
              src={logoDataUrl}
              alt={`${SITE_META.brandName} logo`}
              width={LOGO_WIDTH}
              height={LOGO_HEIGHT}
              style={{
                width: `${LOGO_WIDTH}px`,
                height: `${LOGO_HEIGHT}px`,
                objectFit: "contain",
              }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                borderRadius: "999px",
                border: "1px solid rgba(242,196,0,0.65)",
                color: "#f2c400",
                fontSize: 30,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "8px 18px",
                alignSelf: "flex-start",
              }}
            >
              {SITE_META.brandName}
            </div>
          )}
          <div
            style={{
              fontSize: 74,
              lineHeight: 1.04,
              fontWeight: 800,
              maxWidth: "1030px",
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "24px",
            borderTop: "1px solid rgba(255,255,255,0.25)",
            paddingTop: "24px",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: 32,
              lineHeight: 1.25,
              color: "rgba(255,255,255,0.92)",
              maxWidth: "860px",
            }}
          >
            {subtitle}
          </div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              color: "#f2c400",
            }}
          >
            demolicerecyklace.cz
          </div>
        </div>
      </div>
    ),
    {
      width: IMAGE_WIDTH,
      height: IMAGE_HEIGHT,
    },
  );
}
