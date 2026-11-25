/**
 * Opções dos formulários de contato (seção "Fale com a gente").
 * Só as chaves ficam aqui; os textos estão em messages → Contact.options.
 */
export const audiences = ["school", "company"] as const;
export type Audience = (typeof audiences)[number];

export const schoolNetworks = ["municipal", "state", "private", "social"] as const;
export const schoolInterests = ["robotics", "environment", "computing", "events"] as const;

export const companyInterests = ["donation", "partnership", "dropoff"] as const;
export const wasteTypes = ["white", "brown", "green", "blue"] as const;
export const wasteVolumes = ["small", "boxes", "large"] as const;
