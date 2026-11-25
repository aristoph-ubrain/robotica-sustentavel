/**
 * Gera as coordenadas (lat/lng) dos pontos de coleta a partir dos endereços.
 *
 * Uso (na raiz do projeto, com internet):
 *   node scripts/geocode-points.mjs           → busca só os pontos ainda sem coordenada
 *   node scripts/geocode-points.mjs --todos   → refaz todos
 *
 * - Usa o Nominatim (OpenStreetMap), respeitando o limite de 1 pedido por segundo.
 * - Salva em src/lib/data/collection-points-coords.json (pode ser editado à mão).
 * - No fim, lista os pontos não encontrados e os que caíram só no nível da rua
 *   ou do bairro: confira esses no Google Maps e corrija o JSON se preciso.
 */
import { readFile, writeFile } from "node:fs/promises";

const DATA = "src/lib/data/collection-points.ts";
const OUT = "src/lib/data/collection-points-coords.json";
const USER_AGENT = "site-institucional-robotica-sustentavel/1.0 (roboticasustentavel@gmail.com)";
const refazerTodos = process.argv.includes("--todos");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Lê os pontos direto do arquivo TS (uma entrada por linha).
const source = await readFile(DATA, "utf8");
const field = (line, key) => line.match(new RegExp(`${key}: "([^"]*)"`))?.[1];
const points = source
  .split("\n")
  .filter((line) => line.trim().startsWith("{ name:"))
  .map((line) => ({
    name: field(line, "name"),
    address: field(line, "address"),
    neighborhood: field(line, "neighborhood"),
    city: field(line, "city"),
  }));

let coords = {};
try {
  coords = JSON.parse(await readFile(OUT, "utf8"));
} catch {
  // primeira execução
}

function queries({ address, neighborhood, city }) {
  const cep = address.match(/CEP (\d{5}-?\d{3})/)?.[1];
  const street = address.split("·")[0].trim();
  const state = city.includes("(SP)") ? "São Paulo" : "Ceará";
  const cityName = city.replace(/\s*\(SP\)/, "");
  const list = [
    [street, neighborhood, cityName, state, "Brasil"].filter(Boolean).join(", "),
    [street.split(",").slice(0, 2).join(","), cityName, state, "Brasil"].join(", "),
  ];
  if (cep) list.push(`${cep}, ${cityName}, Brasil`);
  return list;
}

async function search(q) {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.search = new URLSearchParams({ q, format: "jsonv2", limit: "1", countrycodes: "br" });
  const response = await fetch(url, { headers: { "User-Agent": USER_AGENT, "Accept-Language": "pt-BR" } });
  if (!response.ok) throw new Error(`Nominatim respondeu ${response.status}`);
  const [hit] = await response.json();
  return hit;
}

const naoEncontrados = [];
const aproximados = [];

for (const point of points) {
  if (!refazerTodos && coords[point.name]) continue;

  let found = null;
  for (const q of queries(point)) {
    await sleep(1100);
    const hit = await search(q);
    if (hit) {
      found = { hit, q };
      break;
    }
  }

  if (!found) {
    naoEncontrados.push(point.name);
    console.log(`✗ ${point.name}`);
    continue;
  }

  const { hit, q } = found;
  coords[point.name] = {
    lat: Number(Number(hit.lat).toFixed(6)),
    lng: Number(Number(hit.lon).toFixed(6)),
    precisao: hit.addresstype ?? hit.type,
    consulta: q,
  };
  if (!["building", "house", "amenity", "office", "shop", "place"].includes(hit.addresstype)) {
    aproximados.push(`${point.name} (${hit.addresstype})`);
  }
  console.log(`✓ ${point.name} → ${coords[point.name].lat}, ${coords[point.name].lng}`);

  // Salva a cada ponto: se a execução cair, dá para continuar de onde parou.
  await writeFile(OUT, JSON.stringify(coords, null, 2) + "\n");
}

await writeFile(OUT, JSON.stringify(coords, null, 2) + "\n");

console.log(`\n${Object.keys(coords).length} de ${points.length} pontos com coordenada.`);
if (naoEncontrados.length) {
  console.log("\nNão encontrados (preencha à mão no JSON):\n- " + naoEncontrados.join("\n- "));
}
if (aproximados.length) {
  console.log("\nAproximados, confira no mapa:\n- " + aproximados.join("\n- "));
}
