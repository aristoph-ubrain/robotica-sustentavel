/**
 * Resultados do Instituto (portfólio 2025).
 * Os rótulos ficam em messages → Impact.stats.<key>.
 * Confirmar os números com o Instituto antes de publicar.
 */
export const impactStats = [
  { key: "tons", value: 95, suffix: "+" },
  { key: "youth", value: 10500, suffix: "" },
  { key: "companies", value: 375, suffix: "" },
  { key: "points", value: 52, suffix: "" },
] as const;

export type ImpactStatKey = (typeof impactStats)[number]["key"];
