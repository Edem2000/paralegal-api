export const RunActor = {
    Algorithm: "algorithm",
    Llm: "llm",
} as const;

export type RunActor = typeof RunActor[keyof typeof RunActor];