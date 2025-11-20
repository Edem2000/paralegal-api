export const MaskingMode = {
    Full: "full",
    ReadableFull: "readable_full",
    KeepTail: "keep_tail",
} as const;

export type MaskingMode = typeof MaskingMode[keyof typeof MaskingMode];