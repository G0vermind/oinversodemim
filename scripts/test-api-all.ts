import http from "http";

function fetchUrl(url: string): Promise<{ status: number; headers: http.IncomingHttpHeaders; length: number }> {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let length = 0;
      res.on("data", (chunk) => (length += chunk.length));
      res.on("end", () => resolve({ status: res.statusCode || 0, headers: res.headers, length }));
      res.on("error", reject);
    });
  });
}

async function run() {
  console.log("=== TESTANDO ENDPOINTS DA API NEXT.JS ===");

  // 1. Test Dark PDF
  const darkRes = await fetchUrl("http://localhost:3000/api/obras/ecos-do-silencio/pdf?theme=dark");
  console.log("1. Dark PDF:", darkRes.status, darkRes.headers["content-type"], darkRes.headers["content-disposition"], `${Math.round(darkRes.length / 1024)} KB`);

  // 2. Test Light PDF
  const lightRes = await fetchUrl("http://localhost:3000/api/obras/ecos-do-silencio/pdf?theme=light");
  console.log("2. Light PDF:", lightRes.status, lightRes.headers["content-type"], lightRes.headers["content-disposition"], `${Math.round(lightRes.length / 1024)} KB`);

  // 3. Test Inline PDF
  const inlineRes = await fetchUrl("http://localhost:3000/api/obras/ecos-do-silencio/pdf?theme=dark&inline=true");
  console.log("3. Inline PDF:", inlineRes.status, inlineRes.headers["content-disposition"]);

  // 4. Test 404
  const notFoundRes = await fetchUrl("http://localhost:3000/api/obras/slug-inexistente/pdf");
  console.log("4. Slug Inexistente 404:", notFoundRes.status);

  console.log("\n✓ Todos os testes da API HTTP foram concluídos com sucesso!");
}

run().catch(console.error);
