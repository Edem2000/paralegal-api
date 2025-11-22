import {Span} from "domain/span/span";
import {Change} from "domain/change/change";

export interface ChangeService {
    buildChanges(originalText: string, spans: Span[]): Change[];
}

export class ChangeServiceImpl implements ChangeService {
    public buildChanges(originalText: string, spans: Span[]): Change[] {
        return spans.map((span) => {
            const { before: contextBefore, after: contextAfter } = this.extractContext(
                originalText,
                span.start,
                span.end,
                30,
            );

            return new Change({
                actor: span.actor,
                kind: span.kind,
                before: span.before,        // оригинальный фрагмент
                after: span.after,          // замаскированный фрагмент
                start: span.start,
                end: span.end,
                contextBefore,
                contextAfter,
                confidence: span.confidence || 1,
                resolution: 'applied',
                createdAt: new Date(),
            });
        });
    }

    private extractContext(
        input: string,
        start: number,
        end: number,
        radius: number = 30,
    ): { before: string; after: string } {
        const beforeStart = Math.max(0, start - radius);
        const before = input.slice(beforeStart, start);

        const afterEnd = Math.min(input.length, end + radius);
        const after = input.slice(end, afterEnd);

        return { before, after };
    }
}
