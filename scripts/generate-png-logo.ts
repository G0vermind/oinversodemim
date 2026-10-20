import fs from "fs";
import path from "path";
import zlib from "zlib";

function crc32(buf: Buffer): number {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);

  const typeAndData = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData), 0);

  return Buffer.concat([len, typeAndData, crc]);
}

function createPng(width: number, height: number): Buffer {
  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // bit depth 8
  ihdr.writeUInt8(6, 9); // RGBA
  ihdr.writeUInt8(0, 10);
  ihdr.writeUInt8(0, 11);
  ihdr.writeUInt8(0, 12);
  const ihdrChunk = makeChunk("IHDR", ihdr);

  // Raw Scanlines: gold amber editorial emblem colors
  const rowBytes = 1 + width * 4;
  const rawData = Buffer.alloc(rowBytes * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowBytes;
    rawData[rowOffset] = 0; // Filter: None

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;

      // Dark noble background (#110F0D) with gold accent (#C88D4E)
      const isBorder =
        x < 4 || x >= width - 4 || y < 4 || y >= height - 4;

      if (isBorder) {
        rawData[pixelOffset] = 200; // R
        rawData[pixelOffset + 1] = 141; // G
        rawData[pixelOffset + 2] = 78; // B
        rawData[pixelOffset + 3] = 200; // A
      } else {
        rawData[pixelOffset] = 17; // R
        rawData[pixelOffset + 1] = 15; // G
        rawData[pixelOffset + 2] = 13; // B
        rawData[pixelOffset + 3] = 255; // A
      }
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idatChunk = makeChunk("IDAT", compressed);
  const iendChunk = makeChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
}

const targetDir = path.join(process.cwd(), "public", "brand");
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

const pngBuffer = createPng(350, 140);
fs.writeFileSync(path.join(targetDir, "logo.png"), pngBuffer);

console.log("✓ Logo PNG gerado com sucesso em public/brand/logo.png (tamanho:", pngBuffer.length, "bytes)");
