import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          backgroundColor: "#110F0D",
          border: "6px solid #C88D4E",
          borderRadius: "36px",
          color: "#C88D4E",
          fontFamily: "Georgia, serif",
        }}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 100 100"
          fill="#C88D4E"
          style={{ marginBottom: "8px" }}
        >
          <path d="M50 0 L59 38 L97 50 L59 62 L50 100 L41 62 L3 50 L41 38 Z" />
        </svg>
        <div
          style={{
            fontSize: "14px",
            fontWeight: "bold",
            letterSpacing: "2px",
            color: "#C88D4E",
          }}
        >
          O INVERSO
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
