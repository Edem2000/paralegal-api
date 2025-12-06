import {Rule} from "domain/_processor/rules";
import {RuleKind} from "domain/_processor/rules/kind";

export class PinflRule extends Rule {
    constructor() {
        super(
            RuleKind.Pinfl,
            /\b\d{14}\b/g,
        );
    }
}