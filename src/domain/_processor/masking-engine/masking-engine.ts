import type {AlgorithmicMatcher, LlmProvider, Masker, Merger} from "domain/_processor";
import {ProcessingConfig} from "domain/_processor/processing-config";

export interface MaskingEngine {
    process(input: string, processingConfig: ProcessingConfig): Promise<any>;
}

export class MaskingEngineImpl implements MaskingEngine {
    constructor(
        private readonly algorithmicMatcher: AlgorithmicMatcher,
        // private readonly llmProvider: LlmProvider,
        private readonly merger: Merger,
        private readonly masker: Masker,
    ) {

    }
    public async process(input: string, processingConfig: ProcessingConfig): Promise<any> {
        const algorithmSpans = this.algorithmicMatcher.findMatches(input, processingConfig);
        // const llmSpans = this.llmProvider.findMatches(input, processingConfig);
        const finalSpans = this.merger.mergeSpans(algorithmSpans, []);

        const result = this.masker.applyMasking(input, finalSpans, processingConfig)

        console.log(finalSpans)
        console.log(result.finalText)
        console.log(result.finalSpans)

        return {  };
    }
}