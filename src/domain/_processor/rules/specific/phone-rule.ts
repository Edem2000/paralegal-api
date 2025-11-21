import {Rule} from "domain/_processor/rules";
import {RuleKind} from "domain/_processor/rules/kind";
import {NotCardLikePhoneSpecification} from "domain/_processor/specifications/specific/not-card-like-phone-specification";

export class PhoneRule extends Rule {
    constructor() {
        super(
            RuleKind.Phone,
            /\+?\d(?:[()\s-]*\d){11}(?![()\s-]*\d)/g,
            new NotCardLikePhoneSpecification(),
        );
    }
}