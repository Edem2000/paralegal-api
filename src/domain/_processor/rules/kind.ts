export const RuleKind = {
    Pinfl: 'pinfl',
    Phone: 'phone',
    Email: 'email',
    Card: 'card',
    Passport: 'passport',
    Tin: 'tin',
    DateOfBirth: 'date_of_birth',
    ResidenceAddress: 'residence_address',
    Name: 'person_name',
    MedicalCondition: 'medical_condition',
    CompanyName: 'company_name',
    CompanyAddress: 'company_address',
    Custom: 'custom',
} as const;

export type RuleKind = typeof RuleKind[keyof typeof RuleKind];

export const allRuleKinds = Object.values(RuleKind);