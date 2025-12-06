import type {ProcessingConfig} from "domain/_processor/processing-config";
import type {LlmProvider, RunResult} from "domain/_processor";

export class LlmProviderImpl implements LlmProvider{
    public async findMatches(inputText: string, config: ProcessingConfig): Promise<RunResult> {
        return { spans: [], stats: { timeTaken: 0}};
    }
}