import { ImageResponse } from "next/og";
import { AUTHOR_NAME, SITE_DESCRIPTION, SITE_NAME } from "../lib/site";

export const alt = `${SITE_NAME} | ${AUTHOR_NAME}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const subtitle = `Por ${AUTHOR_NAME}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0E0C0A",
          color: "#EAE1D3",
          padding: "60px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            border: "1px solid #2C241D",
            padding: "50px 70px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "60px",
              fontWeight: "bold",
              color: "#D1A752",
              marginBottom: "14px",
              letterSpacing: "2px",
              fontFamily: "Georgia, serif",
            }}
          >
            {SITE_NAME}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "26px",
              fontStyle: "italic",
              color: "#A39787",
              marginBottom: "20px",
              fontFamily: "Georgia, serif",
            }}
          >
            {subtitle}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "18px",
              color: "#EAE1D3",
              maxWidth: "680px",
              lineHeight: 1.6,
              fontFamily: "Georgia, serif",
            }}
          >
            {SITE_DESCRIPTION}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
