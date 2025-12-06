import type {AlgorithmicMatcher, LlmProvider, Masker, Merger} from "domain/_processor";
import type {ProcessingConfig} from "domain/_processor/processing-config";
import type {ChangeService} from "domain/change/service";
import type {Span} from "domain/span/span";
import type {Change} from "domain/change/change";
import type {Transaction} from "domain/transaction/transaction";

export interface MaskingEngine {
    process(transaction: Transaction, processingConfig: ProcessingConfig): Promise<MaskResult>;
}

export class MaskingEngineImpl implements MaskingEngine {
    constructor(
        private readonly algorithmicMatcher: AlgorithmicMatcher,
        private readonly llmProvider: LlmProvider,
        private readonly merger: Merger,
        private readonly masker: Masker,
        private readonly changeService: ChangeService,
    ) {}

    public async process(transaction: Transaction, processingConfig: ProcessingConfig): Promise<MaskResult> {
        const originalText = transaction.inputText;

        const algorithmRunResult = this.algorithmicMatcher.findMatches(originalText, processingConfig);

        const llmRunResult =
            processingConfig.llmKinds.length > 0 || processingConfig.customQueries.length > 0
            ? await this.llmProvider.findMatches(originalText, processingConfig)
            : { spans: [], stats: { timeTaken: 0 } };

        const finalSpans = this.merger.mergeSpans(algorithmRunResult.spans, llmRunResult.spans);

        const result = this.masker.applyMasking(originalText, finalSpans, processingConfig);

        transaction.finalText = result.finalText;
        transaction.stats = {
            algorithmTime: algorithmRunResult.stats.timeTaken,
            llmTime: llmRunResult.stats.timeTaken,
            llmTokenUsage: llmRunResult.stats.usage,
        };

        const changes = this.changeService.buildChanges(transaction, result.finalSpans);

        // console.log(result.finalSpans);
        // console.log(changes);

        return {
            finalText: result.finalText,
            finalSpans: result.finalSpans,
            changes,
        };
    }
}

export type MaskResult = {
    finalText: string,
    finalSpans: Span[],
    changes: Change[],
}

export type RunResult = {
    spans: Span[];
    stats: {
        timeTaken: number;
        usage?: object
    }
}