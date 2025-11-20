import {Rule} from "domain/_processor/rules";
import {RuleKind} from "domain/_processor/rules/kind";

export class CardRule extends Rule {
    constructor() {
        super(
            RuleKind.Card,
            /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
            // сюда позже можно подвесить LuhnSpecification
        );
    }
}