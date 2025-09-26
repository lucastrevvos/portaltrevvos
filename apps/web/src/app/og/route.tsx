// apps/web/src/app/og/route.tsx
import { ImageResponse } from "next/og";

export const runtime = "edge"; // ok export
export const dynamic = "force-dynamic"; // ok export

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const title = (searchParams.get("title") ?? "Trevvos").slice(0, 120);
  const subtitle = (searchParams.get("subtitle") ?? "").slice(0, 160);
  const cover = searchParams.get("cover") ?? ""; // pode ser vazio

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          fontFamily: "Inter, Arial, sans-serif",
          background: "#0b0f0e",
          color: "white",
        }}
      >
        {/* cover opcional */}
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.25,
            }}
          />
        ) : null}

        <div
          style={{
            display: "flex",
            flex: 1,
            padding: "56px 72px",
            gap: 24,
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              background: "rgba(16,185,129,0.15)",
              color: "rgb(16,185,129)",
              border: "1px solid rgba(16,185,129,0.35)",
              padding: "6px 12px",
              borderRadius: 999,
              fontSize: 24,
            }}
          >
            Trevvos
          </div>

          <div style={{ fontSize: 60, fontWeight: 800, lineHeight: 1.1 }}>
            {title}
          </div>

          {subtitle ? (
            <div
              style={{
                marginTop: 8,
                fontSize: 30,
                lineHeight: 1.4,
                color: "rgba(255,255,255,0.85)",
                maxWidth: 1000,
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
