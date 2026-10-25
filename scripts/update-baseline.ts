import fs from "fs";
import path from "path";
import { getObras } from "../lib/data";
import { Obra } from "../lib/schemas/obra";

const fixturePath = path.join(process.cwd(), "tests", "fixtures", "obras.baseline.json");
const currentObras = getObras();

const normalizedCurrent = currentObras.map((obra: Obra) => ({
  ...obra,
  createdAt:
    obra.createdAt instanceof Date
      ? obra.createdAt.toISOString().slice(0, 10)
      : String(obra.createdAt).slice(0, 10),
  updatedAt:
    obra.updatedAt instanceof Date
      ? obra.updatedAt.toISOString().slice(0, 10)
      : String(obra.updatedAt).slice(0, 10),
  poemas: obra.poemas?.map((poema) => ({
    ...poema,
    publicadoEm:
      poema.publicadoEm instanceof Date
        ? poema.publicadoEm.toISOString().slice(0, 10)
        : String(poema.publicadoEm).slice(0, 10),
  })),
}));

fs.writeFileSync(fixturePath, JSON.stringify(normalizedCurrent, null, 2), "utf-8");
console.log(`✓ Baseline atualizada em: ${fixturePath}`);
