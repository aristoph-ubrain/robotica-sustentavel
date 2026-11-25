/**
 * Pontos de coleta voluntária de resíduos eletrônicos.
 * Fonte: planilha enviada pelo Instituto (nov/2026).
 *
 * Pendências para confirmar com o Instituto:
 * - O portfólio fala em 52 e em 54 pontos; esta lista tem 53.
 * - "Olmix" fica em Bora (SP), fora do Ceará.
 * - Alguns endereços vieram sem CEP ou com o texto cortado na planilha.
 */
import coordinates from "./collection-points-coords.json";

type RawPoint = {
  name: string;
  address: string;
  /** Bairro, quando informado. Usado na busca. */
  neighborhood?: string;
  city: string;
};

export type CollectionPoint = RawPoint & {
  id: string;
  /** Sede do Instituto: ganha destaque no mapa. */
  isHeadquarters: boolean;
  /** Coordenadas geradas por `node scripts/geocode-points.mjs`. */
  lat?: number;
  lng?: number;
};

const rawPoints: RawPoint[] = [
  { name: "Sede Robótica Sustentável", address: "Rua Francisquinha Portela, 1050 C, Altos · CEP 60351-840", city: "Fortaleza" },
  { name: "Ninna Hub", address: "Av. Dom Manuel, 1020 · CEP 60060-090", neighborhood: "Centro", city: "Fortaleza" },
  { name: "Transforme Coworking", address: "Rua Torres Câmara, 600, Casa 47 · CEP 60150-060", neighborhood: "Aldeota", city: "Fortaleza" },
  { name: "IEL Ceará", address: "Av. Barão de Studart, 1980, Mezanino · CEP 60120-001", neighborhood: "Aldeota", city: "Fortaleza" },
  { name: "SINDIVERDE", address: "Av. Barão de Studart, 1980, 1º andar · CEP 60120-001", neighborhood: "Aldeota", city: "Fortaleza" },
  { name: "Unifametro", address: "R. Carneiro da Cunha, 180 · CEP 60010-470", neighborhood: "Jacarecanga", city: "Fortaleza" },
  { name: "ALECE", address: "Av. Des. Moreira, 2807 · CEP 60170-173", neighborhood: "Dionísio Torres", city: "Fortaleza" },
  { name: "COGERH", address: "R. Adualdo Batista, 1550 · CEP 60824-140", neighborhood: "Cambeba", city: "Fortaleza" },
  { name: "CONJER", address: "Rua Moisés, 290 · CEP 60353-160", neighborhood: "Quintino Cunha", city: "Fortaleza" },
  { name: "SEBRAELAB", address: "R. Antônio Augusto, 290 · CEP 60110-370", neighborhood: "Meireles", city: "Fortaleza" },
  { name: "Elephant Coworking", address: "R. Barbosa de Freitas, 1741 · CEP 60170-021", neighborhood: "Aldeota", city: "Fortaleza" },
  { name: "IST SENAI", address: "Av. Sen. Virgílio Távora, 1395 · CEP 61939-160", neighborhood: "Distrito Industrial I", city: "Maracanaú" },
  { name: "Hotel Sonata", address: "Av. Beira Mar, 848 · CEP 60165-120", neighborhood: "Praia de Iracema", city: "Fortaleza" },
  { name: "Planet Coworking", address: "R. Major Facundo, 692 · CEP 60025-100", neighborhood: "Centro", city: "Fortaleza" },
  { name: "Condomínio Antonio Martins", address: "Rua Maria Tomásia, 855 · CEP 60150-170", neighborhood: "Aldeota", city: "Fortaleza" },
  { name: "Pague Menos", address: "R. Sen. Pompeu, 1502 · CEP 60025-001", neighborhood: "Centro", city: "Fortaleza" },
  { name: "Vapt Vupt — Centro", address: "Shopping Central, R. Gen. Sampaio, 835, Loja 162 · CEP 60020-030", neighborhood: "Centro", city: "Fortaleza" },
  { name: "Vapt Vupt — RioMar Fortaleza", address: "RioMar Papicu, R. Des. Lauro Nogueira, 1500, Loja 2093", neighborhood: "Papicu", city: "Fortaleza" },
  { name: "Vapt Vupt — Antônio Bezerra", address: "R. Demétrio Menezes, 3750 · CEP 60356-550", neighborhood: "Antônio Bezerra", city: "Fortaleza" },
  { name: "Vapt Vupt — Messejana", address: "Av. Jornalista Tomaz Coelho, 408 · CEP 60842-021", neighborhood: "Messejana", city: "Fortaleza" },
  { name: "Toyota Newland WS", address: "Av. Washington Soares, 1550", neighborhood: "Edson Queiroz", city: "Fortaleza" },
  { name: "Newsedan Mercedes-Benz", address: "Av. Rogaciano Leite, 323", neighborhood: "Guararapes", city: "Fortaleza" },
  { name: "Newcenter Porsche", address: "Av. Washington Soares, 85A", neighborhood: "Edson Queiroz", city: "Fortaleza" },
  { name: "Faculdade CDL", address: "R. Vinte e Cinco de Março, 780", neighborhood: "Centro", city: "Fortaleza" },
  { name: "Faculdade INBEC", address: "R. Joaquim Nabuco, 2906 · CEP 60125-121", neighborhood: "Dionísio Torres", city: "Fortaleza" },
  { name: "Instituto Atlântico", address: "Av. Washington Soares, 909, Lojas 42 a 45", neighborhood: "Edson Queiroz", city: "Fortaleza" },
  { name: "Sellene Hospitalar", address: "R. João Carvalho, 205 · CEP 60140-140", neighborhood: "Aldeota", city: "Fortaleza" },
  { name: "Associação ARCOS / ARCOS Ponto de Cultura", address: "Av. João Lopes Meireles · CEP 62680-000", city: "Paracuru" },
  { name: "Termaco Portuário", address: "BR-116, km 4, 7250 · CEP 60864-012", neighborhood: "Cajazeiras", city: "Fortaleza" },
  { name: "Meireles e Freitas", address: "R. Sena Madureira, 1070 · CEP 60055-080", neighborhood: "Centro", city: "Fortaleza" },
  { name: "Condomínio Gran Parc", address: "R. dos Amigos, 100 · CEP 60822-168", neighborhood: "Cambeba", city: "Fortaleza" },
  { name: "Maranguape", address: "Av. Dr. Estênio Gomes, 795 · CEP 61948-040", neighborhood: "Parque Iracema", city: "Maranguape" },
  { name: "Locmed", address: "R. Herbene, 425 · CEP 60842-120", neighborhood: "Messejana", city: "Fortaleza" },
  { name: "Cequip", address: "BR-116, 3439 · CEP 60873-815", neighborhood: "Paupina", city: "Fortaleza" },
  { name: "Conecty Fibra", address: "Av. João Lopes Meireles, 1421 · CEP 62680-000", neighborhood: "Campo de Aviação", city: "Paracuru" },
  { name: "Silicontech", address: "Rua Doutor José Lourenço, 1300 · CEP 60115-281", city: "Fortaleza" },
  { name: "UECE", address: "Av. Dr. Silas Munguba, 1700 · CEP 60714-903", neighborhood: "Itaperi", city: "Fortaleza" },
  { name: "Associação Arte e Acordes ARCOS", address: "Av. João Lopes Meireles · CEP 62680-000", city: "Paracuru" },
  { name: "Super Mercadinhos São Luiz — Loja Oliveira Paiva", address: "Av. Oliveira Paiva, 170 · CEP 60822-310", neighborhood: "Cidade dos Funcionários", city: "Fortaleza" },
  { name: "Olmix", address: "Rod. Bora/Quintana, s/n, km 13,3 + 1200 m, Portaria 2 · CEP 19740-000", city: "Bora (SP)" },
  { name: "Concentrix", address: "R. Gonçalves Lêdo, 777 · CEP 60060-325", neighborhood: "Centro", city: "Fortaleza" },
  { name: "Line Coworking", address: "Av. Visconde do Rio Branco, 3609 · CEP 60055-172", neighborhood: "Joaquim Távora", city: "Fortaleza" },
  { name: "LC — Aço Cearense", address: "Av. Barão de Studart, 300, Salas 1401 a 1516 · CEP 60120-000", neighborhood: "Meireles", city: "Fortaleza" },
  { name: "ACC Filial 1919 — Aço Cearense", address: "R. Antônio Pompeu, 1919 A · CEP 60015-107", neighborhood: "Farias Brito", city: "Fortaleza" },
  { name: "ACC Filial 2000 — Aço Cearense", address: "Av. Duque de Caxias, 2000 · CEP 60035-078", neighborhood: "Jacarecanga", city: "Fortaleza" },
  { name: "ACL — Aço Cearense", address: "R. Cruzeiro do Sul, s/n, km 18 · CEP 61616-050", neighborhood: "Genipabu", city: "Caucaia" },
  { name: "ACI Matriz — Aço Cearense", address: "Antiga Rodovia BR-222, s/n, km 19 · CEP 61616-000", neighborhood: "Genipabu", city: "Caucaia" },
  { name: "ACI Filial — Aço Cearense", address: "Rodovia BR-222, s/n, km 21", neighborhood: "Genipabu", city: "Caucaia" },
  { name: "Condomínio Singular 1", address: "Forlife Alegria, Rua B, 191", neighborhood: "Maraponga", city: "Fortaleza" },
  { name: "Condomínio Singular 2", address: "Forlife Diversão, Rua B, 20", neighborhood: "Maraponga", city: "Fortaleza" },
  { name: "SEFAZ 02", address: "Av. Alberto Nepomuceno, 77, Sede 4 · CEP 60055-000", neighborhood: "Centro", city: "Fortaleza" },
  { name: "Digital College Aldeota", address: "Av. Santos Dumont, 1510, 1º andar · CEP 60150-161", neighborhood: "Aldeota", city: "Fortaleza" },
  { name: "Digital College Sul", address: "Av. Washington Soares, 3663, Torre 2, 4º andar · CEP 60811-341", neighborhood: "Edson Queiroz", city: "Fortaleza" },
];

const coords = coordinates as Record<string, { lat: number; lng: number } | undefined>;

const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const collectionPoints: CollectionPoint[] = rawPoints.map((point) => {
  const position = coords[point.name];
  return {
    ...point,
    id: slugify(point.name),
    isHeadquarters: point.name === "Sede Robótica Sustentável",
    ...(position ? { lat: position.lat, lng: position.lng } : {}),
  };
});

/** Cidades presentes na lista, na ordem em que aparecem (Fortaleza primeiro). */
export const collectionCities = Array.from(new Set(rawPoints.map((p) => p.city)));
