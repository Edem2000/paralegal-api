import {ProcessingConfig} from "domain/_processor/processing-config";
import {Span} from "domain/span/span";
import {Rule} from "domain/_processor/rules";

export interface AlgorithmicMatcher {
    findMatches(inputText: string, config: ProcessingConfig): Span[];
}

export class AlgorithmicMatcherImpl implements AlgorithmicMatcher {
    constructor(private readonly rules: Rule[]) {}

    findMatches(inputText: string, config: ProcessingConfig): Span[] {
        const enabledKinds = new Set(
            config.kinds.filter((k) => k.enabled).map((k) => k.kind),
        );

        const spans: Span[] = [];

        for (const rule of this.rules) {
            if (!enabledKinds.has(rule.kind)) continue;
            const ruleSpans = rule.findMatches(inputText);
            spans.push(...ruleSpans);
        }

        return spans;
    }
}