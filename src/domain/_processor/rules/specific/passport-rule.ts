import {Rule} from "domain/_processor/rules";
import {RuleKind} from "domain/_processor/rules/kind";

export class PassportRule extends Rule {
    constructor() {
        super(
            RuleKind.Passport,
            /\b[A-Z]{2}\d{7}\b/gi,
        );
    }
}