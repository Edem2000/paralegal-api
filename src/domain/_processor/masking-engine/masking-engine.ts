import type {AlgorithmicMatcher, LlmProvider, Merger} from "domain/_processor";

export interface MaskingEngine {
    process(input: string): Promise<any>;
}

export class MaskingEngineImpl implements MaskingEngine {
    constructor(
        private readonly algorithmicMatcher: AlgorithmicMatcher,
        private readonly llmProvider: LlmProvider,
        private readonly merger: Merger,
    ) {

    }
    public async process(input: string): Promise<any> {
        return {};
    }
}