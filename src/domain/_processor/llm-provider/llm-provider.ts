import type {ProcessingConfig} from "domain/_processor/processing-config";
import type {Span} from "domain/span/span";
import {RunResult} from "domain/_processor";

export interface LlmProvider {
    findMatches(inputText: string, config: ProcessingConfig): Promise<RunResult>;
}