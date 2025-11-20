import {Rule} from "domain/_processor/rules";
import {RuleKind} from "domain/_processor/rules/kind";

export class InnRule extends Rule {
    constructor() {
        super(
            RuleKind.Tin,
            /\b\d{9,14}\b/g,
        );
    }
}