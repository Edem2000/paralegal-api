import {RuleKind} from "domain/_processor/rules/kind";

export const RulePriority: Record<RuleKind, number> = {
    pinfl: 120,
    card: 100,
    passport: 90,
    tin: 80,
    email: 70,
    phone: 60,
    custom: 10,
    date_of_birth: 5,
    residence_address: 5,
    person_name: 5,
    medical_condition: 5,
    company_name: 5,
    company_address: 5,
};