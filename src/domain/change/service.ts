import {Span} from "domain/span/span";
import {Change, ChangeModel} from "domain/change/change";
import {Transaction} from "domain/transaction/transaction";
import {ChangeRepository} from "domain/change/repository";
import {Identifier} from "domain/_core";

export interface ChangeService {
    buildChanges(transaction: Transaction, spans: Span[]): Change[];
    getByTransactionId(transactionId: Identifier): Change[];
}

export class ChangeServiceImpl implements ChangeService {
    constructor(private readonly repository: ChangeRepository) {}
    public buildChanges(transaction: Transaction, spans: Span[]): Change[] {
        const originalText = transaction.inputText;
        const maskedText = transaction.finalText ?? originalText; // на всякий случай
        const sortedSpans = spans.sort((a, b) => a.start - b.start);

        let offsetDelta = 0;

        return sortedSpans.map((span) => {
            const originalLength = span.end - span.start;

            const { before: contextBefore, after: contextAfter } = this.extractContext(
                originalText,
                span.start,
                span.end,
                20,
            );

            const maskedLength = span.after.length;

            // new coordinates in finalText after masking
            const maskedStart = span.start + offsetDelta;
            const maskedEnd = maskedStart + maskedLength;

            // after this span text length changed for:
            offsetDelta += maskedLength - originalLength;

            // calculating resulting context after masking
            const {
                before: maskedContextBefore,
                after: maskedContextAfter,
            } = this.extractContext(
                maskedText,
                maskedStart,
                maskedEnd,
                20,
            );

            return this.create({
                transactionId: transaction.id,
                actor: span.actor,
                kind: span.kind,
                before: span.before,
                beforeDetails: {
                    start: span.start,
                    end: span.end,
                    contextBefore: contextBefore,
                    contextAfter: contextAfter,
                },
                after: span.after,
                afterDetails: {
                    start: maskedStart,
                    end: maskedEnd,
                    contextBefore: maskedContextBefore,
                    contextAfter: maskedContextAfter,
                },
                confidence: span.confidence || 1,
                resolution: 'applied',
            });
        });
    }

    public create(data: Omit<ChangeModel, "createdAt">): Change {
        const change = new Change({
            ...data,
            createdAt: new Date(),
        });

        this.repository.create(change);

        return change;
    }

    public getByTransactionId(transactionId: Identifier): Change[] {
        return this.repository.getByTransactionId(transactionId);
    }

    private extractContext(
        input: string,
        start: number,
        end: number,
        radius: number = 20,
    ): { before: string; after: string } {
        let beforeStart = Math.max(0, start - radius);
        // const before = input.slice(beforeStart, start);

        let afterEnd = Math.min(input.length, end + radius);
        // const after = input.slice(end, afterEnd);

        // 2. Расширяем left boundary до начала слова
        // Движемся влево, пока буква/цифра/подчёркивание
        while (beforeStart > 0 && /\w|\p{L}|\p{N}/u.test(input[beforeStart])) {
            beforeStart--;
        }

        // 3. Расширяем right boundary до конца слова
        while (afterEnd < input.length && /\w|\p{L}|\p{N}/u.test(input[afterEnd - 1])) {
            afterEnd++;
        }

        // 4. Формируем итоговые строки
        const before = input.slice(beforeStart, start);
        const after = input.slice(end, afterEnd);

        return { before, after };
    }
}
