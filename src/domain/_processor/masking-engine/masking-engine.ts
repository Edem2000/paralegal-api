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
    ) {

    }
    public async process(transaction: Transaction, processingConfig: ProcessingConfig): Promise<MaskResult> {
        const originalText = transaction.inputText;

        const algorithmSpans = this.algorithmicMatcher.findMatches(originalText, processingConfig);

        const llmSpans = await this.llmProvider.findMatches(originalText, processingConfig);

        console.log("llm results", llmSpans)

        const finalSpans = this.merger.mergeSpans(algorithmSpans, llmSpans);

        const result = this.masker.applyMasking(originalText, finalSpans, processingConfig);

        transaction.finalText = result.finalText;

        const changes = this.changeService.buildChanges(transaction, result.finalSpans);

        // console.log(result.finalText);
        // console.log(result.finalSpans);
        // console.log(changes);

        return { finalText: result.finalText, finalSpans: result.finalSpans, changes };
    }
}

export type MaskResult = {
    finalText: string,
    finalSpans: Span[],
    changes: Change[],
}