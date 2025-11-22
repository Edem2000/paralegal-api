import {RuleKind} from "domain/_processor/rules/kind";

export const RulePriority: Record<RuleKind, number> = {
    card: 100,
    passport: 90,
    tin: 80,
    email: 70,
    phone: 60,
};