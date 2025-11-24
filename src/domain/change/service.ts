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
        return spans.map((span) => {
            const { before: contextBefore, after: contextAfter } = this.extractContext(
                originalText,
                span.start,
                span.end,
                30,
            );

            return this.create({
                transactionId: transaction.id,
                actor: span.actor,
                kind: span.kind,
                before: span.before,
                after: span.after,
                start: span.start,
                end: span.end,
                contextBefore,
                contextAfter,
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
        radius: number = 30,
    ): { before: string; after: string } {
        const beforeStart = Math.max(0, start - radius);
        const before = input.slice(beforeStart, start);

        const afterEnd = Math.min(input.length, end + radius);
        const after = input.slice(end, afterEnd);

        return { before, after };
    }
}
