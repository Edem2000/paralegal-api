import {ProcessingConfig} from "domain/_processor/processing-config";
import {Span} from "domain/span/span";
import {Rule} from "domain/_processor/rules";
import {RunResult} from "domain/_processor";

export interface AlgorithmicMatcher {
    findMatches(inputText: string, config: ProcessingConfig): RunResult;
}

export class AlgorithmicMatcherImpl implements AlgorithmicMatcher {
    constructor(private readonly rules: Rule[]) {}

    findMatches(inputText: string, config: ProcessingConfig): RunResult {
        console.log(`Started algorithm run at ${new Date().toISOString()}`);
        const startTime = Date.now();
        const enabledKinds = new Set(
            config.kinds.filter((k) => k.enabled).map((k) => k.kind),
        );

        const spans: Span[] = [];

        for (const rule of this.rules) {
            if (!enabledKinds.has(rule.kind)) continue;
            const ruleSpans = rule.findMatches(inputText);
            spans.push(...ruleSpans);
        }
        console.log(`Finished algorithm run at ${new Date().toISOString()}`);
        const endTime = Date.now();

        const timeTaken = endTime - startTime;

        return {spans, stats: { timeTaken }};
    }
}