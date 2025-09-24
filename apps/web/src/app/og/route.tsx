import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";
export const alt = "Trevvos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const brand = {
  name: "Trevvos",
  color: "#059669", // emerald-600
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") ?? "Trevvos").slice(0, 140);
  const subtitle = (searchParams.get("subtitle") ?? "").slice(0, 200);
  const cover = searchParams.get("cover") ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#fff",
          fontFamily: "Inter, ui-sans-serif, system-ui",
        }}
      >
        {cover ? (
          <img
            src={cover}
            width={1200}
            height={400}
            style={{ objectFit: "cover", width: "100%", height: 400 }}
          />
        ) : (
          <div
            style={{
              height: 400,
              width: "100%",
              background:
                "linear-gradient(135deg, rgba(16,185,129,.12), rgba(5,150,105,.08))",
            }}
          />
        )}
        <div style={{ padding: "40px 56px", display: "flex", gap: 24 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: brand.color,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            T
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{
                fontSize: 48,
                lineHeight: 1.1,
                fontWeight: 800,
                color: "#0a0a0a",
              }}
            >
              {title}
            </div>
            {subtitle && (
              <div
                style={{
                  fontSize: 24,
                  color: "#525252",
                  maxWidth: 950,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {subtitle}
              </div>
            )}
            <div style={{ marginTop: 8, fontSize: 20, color: brand.color }}>
              {brand.name}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
