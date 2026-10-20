import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
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
          border: "12px solid #C88D4E",
          borderRadius: "96px",
          color: "#C88D4E",
          fontFamily: "Georgia, serif",
        }}
      >
        <svg
          width="130"
          height="130"
          viewBox="0 0 100 100"
          fill="#C88D4E"
          style={{ marginBottom: "16px" }}
        >
          <path d="M50 0 L59 38 L97 50 L59 62 L50 100 L41 62 L3 50 L41 38 Z" />
        </svg>
        <div
          style={{
            fontSize: "36px",
            fontWeight: "bold",
            letterSpacing: "6px",
            color: "#C88D4E",
          }}
        >
          O INVERSO
        </div>
        <div
          style={{
            fontSize: "26px",
            fontStyle: "italic",
            color: "#F5EFE6",
            letterSpacing: "4px",
            marginTop: "4px",
          }}
        >
          DE MIM
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
