import type {AlgorithmicMatcher, LlmProvider, Masker, Merger} from "domain/_processor";
import {ProcessingConfig} from "domain/_processor/processing-config";
import {ChangeService} from "domain/change/service";
import {Span} from "domain/span/span";
import {Change} from "domain/change/change";

export interface MaskingEngine {
    process(input: string, processingConfig: ProcessingConfig): Promise<MaskResult>;
}

export class MaskingEngineImpl implements MaskingEngine {
    constructor(
        private readonly algorithmicMatcher: AlgorithmicMatcher,
        // private readonly llmProvider: LlmProvider,
        private readonly merger: Merger,
        private readonly masker: Masker,
        private readonly changeService: ChangeService,
    ) {

    }
    public async process(input: string, processingConfig: ProcessingConfig): Promise<MaskResult> {
        const algorithmSpans = this.algorithmicMatcher.findMatches(input, processingConfig);
        // const llmSpans = this.llmProvider.findMatches(input, processingConfig);
        const finalSpans = this.merger.mergeSpans(algorithmSpans, []);

        const result = this.masker.applyMasking(input, finalSpans, processingConfig)

        const changes = this.changeService.buildChanges(input, result.finalSpans);


        console.log(finalSpans)
        console.log(result.finalText)
        console.log(result.finalSpans)

        console.log(changes)
        return { finalText: result.finalText, finalSpans: result.finalSpans, changes };
    }
}

export type MaskResult = {
    finalText: string;
    finalSpans: Span[];
    changes: Change[]
}