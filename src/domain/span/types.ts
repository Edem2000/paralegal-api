export const RunActor = {
    Algorithm: "algorithm",
    Llm: "llm",
    Final: "final",
} as const;

export type RunActor = typeof RunActor[keyof typeof RunActor];