export const RuleKind = {
    Phone: 'phone',
    Email: 'email',
    Card: 'card',
    Passport: 'passport',
    Tin: 'tin',
} as const;

export type RuleKind = typeof RuleKind[keyof typeof RuleKind];

export const allRuleKinds = Object.values(RuleKind);