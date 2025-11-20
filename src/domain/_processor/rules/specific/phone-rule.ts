import {Rule} from "domain/_processor/rules";
import {RuleKind} from "domain/_processor/rules/kind";

export class PhoneRule extends Rule {
    constructor() {
        super(
            RuleKind.Phone,
            /\+?\d[\d\s\-()]{7,12}\d/g,
        );
    }
}