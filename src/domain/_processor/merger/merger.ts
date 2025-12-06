import {Span} from "domain/span/span";
import {RunActor} from "domain/span/types";
import {Rule, RuleKind} from "domain/_processor/rules";
import {MaskingMode, ProcessingConfig} from "domain/_processor/processing-config";
import {FullBlockPolicy, KeepTailPolicy, MaskPolicy, ReadableFullBlockPolicy} from "domain/_processor/policies";

export interface Merger {
    mergeSpans(algorithmSpans: Span[], llmSpans: Span[]): Span[];
}

export class MergerImpl implements Merger {
    private readonly obviousKinds: Set<RuleKind>;

    constructor(
        rules: Rule[],
        private readonly rulePriority: Record<RuleKind, number>,
    ) {
        this.obviousKinds = new Set(rules.map((r) => r.kind));
    }

    public mergeSpans(algorithmSpans: Span[], llmSpans: Span[]): Span[] {
        // 1) отбрасываем LLM-спаны “очевидных” типов
        const llmClean = llmSpans.filter(
            (s) => !this.obviousKinds.has(s.kind),
        );

        // 2) объединяем
        const all = [...algorithmSpans, ...llmClean];

        // 3) сортируем
        all.sort((a, b) => a.start - b.start || b.end - a.end);

        // 4) однопроходное разрешение пересечений
        const out: Span[] = [];
        for (const s of all) {
            const clashIndex = out.findIndex((o) => this.isOverlap(s, o));
            if (clashIndex === -1) {
                out.push(s);
                continue;
            }

            const winner = this.chooseWinner(s, out[clashIndex]);

            out[clashIndex] = winner;
        }

        return out;
    }

    private chooseWinner(a: Span, b: Span): Span {
        let winner: Span = a;
        const pa = this.rulePriority[a.kind];
        const pb = this.rulePriority[b.kind];

        if (pa !== pb) winner = pa > pb ? a : b;

        const lenA = a.end - a.start;
        const lenB = b.end - b.start;
        if (lenA !== lenB) winner = lenA > lenB ? a : b;

        if (a.actor !== b.actor) winner = a.actor === RunActor.Algorithm ? a : b;

        const ca = a.confidence ?? 0;
        const cb = b.confidence ?? 0;

        if (ca !== cb) winner = ca > cb ? a : b;

        return winner;
    }

    private isOverlap(a: Span, b: Span): boolean {
        return !(a.end <= b.start || a.start >= b.end);
    };
}