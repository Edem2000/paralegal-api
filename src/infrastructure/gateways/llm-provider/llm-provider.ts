import type {ProcessingConfig} from "domain/_processor/processing-config";
import type {Span} from "domain/span/span";
import type {LlmProvider} from "domain/_processor";

export class LlmProviderImpl implements LlmProvider{
    public async findMatches(inputText: string, config: ProcessingConfig): Promise<Span[]> {
        return [];
    }
}