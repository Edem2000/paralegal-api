import {Span} from "domain/span/span";
import {RuleKind} from "domain/_processor/rules";
import {MaskingMode, ProcessingConfig} from "domain/_processor/processing-config";
import {FullBlockPolicy, KeepTailPolicy, MaskPolicy, ReadableFullBlockPolicy} from "domain/_processor/policies";
import {KeepHeadAndTailPolicy} from "domain/_processor/policies/keep-head-and-tail-policy";

export interface Masker {
    applyMasking(inputText: string, spans: Span[], config: ProcessingConfig): MaskingResult;
}

export interface MaskingResult {
    finalText: string;
    finalSpans: Span[];
}

export class MaskerImpl implements Masker {

    public applyMasking(inputText: string, spans: Span[], config: ProcessingConfig): MaskingResult {

        const sorted = spans.sort(
            (a, b) => a.start - b.start || b.end - a.end,
        );

        let out = '';
        let cursor = 0;
        const finalSpans: Span[] = [];

        for (const span of sorted) {
            const policy = this.buildPolicy(span.kind, config);

            const before = inputText.slice(span.start, span.end);
            const after = policy.mask(before);

            out += inputText.slice(cursor, span.start);
            out += after;

            finalSpans.push(new Span({
                kind: span.kind,
                start: span.start,
                end: span.end,
                before,
                after,
                actor: span.actor,
            }));

            cursor = span.end;
        }

        out += inputText.slice(cursor);

        return {
            finalText: out,
            finalSpans,
        };
    }

    private buildPolicy(kind: RuleKind, config: ProcessingConfig): MaskPolicy {
        switch (config.maskingMode) {
            case MaskingMode.Full:
                return new FullBlockPolicy();

            case MaskingMode.ReadableFull:
                return new ReadableFullBlockPolicy(kind);

            case MaskingMode.KeepTail:
                return new KeepTailPolicy();

            case MaskingMode.KeepHeadTail:
                return new KeepHeadAndTailPolicy();

            default:
                return new FullBlockPolicy(); // fallback
        }
    }
}