import {RunActor} from "domain/change/types";
import {Span} from "domain/span/span";
import {RuleKind} from "domain/_processor/rules";
import {Specification, TrueSpecification} from "domain/_processor/specifications";

export abstract class Rule {
    protected constructor(
        public readonly kind: RuleKind,
        protected readonly pattern: RegExp,
        protected readonly specification: Specification<string> = new TrueSpecification(),
    ) {}

    findMatches(input: string): Span[] {
        const spans: Span[] = [];

        // creating RegExp instance for saving lastIndex
        const regexp = new RegExp(this.pattern.source, this.pattern.flags.includes('g')
            ? this.pattern.flags
            : this.pattern.flags + 'g',
        );

        let match: RegExpExecArray | null;
        while ((match = regexp.exec(input)) !== null) {
            const before = match[0];
            if (!this.specification.isSatisfiedBy(before)) {
                continue;
            }

            const start = match.index;
            const end = start + before.length;

            const span = new Span({
                kind: this.kind,
                start,
                end,
                before,
                after: before,     // real mask is to be added at further steps
                actor: RunActor.Algorithm,
            })

            spans.push(span);
        }

        return spans;
    }
}