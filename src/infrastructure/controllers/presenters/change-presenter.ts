import {Change} from "domain/change/change";
import type {HexString} from "domain/_core";
import type {RunActor} from "domain/change/types";

export class ChangePresenter {
    public static present(change: Change): ChangeResponseDto {
        return {
            id: change.id.toString(),
            transactionId: change.transactionId.toString(),
            runId: change.runId?.toString(),
            actor: change.actor,
            kind: change.kind,
            before: change.before,
            after: change.after,
            start: change.start,
            end: change.end,
            contextBefore: change.contextBefore,
            contextAfter: change.contextAfter,
            confidence: change.confidence,
            resolution: change.resolution,
            createdAt: change.createdAt.toISOString(),
        };
    }
}

export type ChangeResponseDto = {
    id: HexString;
    transactionId: HexString;
    runId?: HexString;
    actor: RunActor,
    kind: string,
    before: string,
    after: string,
    start: number,
    end: number,
    contextBefore: string,
    contextAfter: string,
    confidence: number,
    resolution: string,
    createdAt: string,
};