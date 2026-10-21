import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  const logoPath = path.join(process.cwd(), "public", "brand", "logo-oficial.png");
  const logoBuffer = fs.readFileSync(logoPath);
  const base64Logo = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#110F0D",
          border: "14px solid #C88D4E",
          borderRadius: "112px",
          padding: "24px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={base64Logo}
          alt="O Inverso de Mim"
          style={{
            width: "450px",
            height: "auto",
            objectFit: "contain",
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
