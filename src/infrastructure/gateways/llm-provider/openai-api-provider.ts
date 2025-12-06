import OpenAI from "openai";
import type {LlmProvider, RunResult} from "domain/_processor";
import type {ProcessingConfig} from "domain/_processor/processing-config";
import {Span, SpanModel} from "domain/span/span";
import { systemPromptV6 } from "infrastructure/gateways/llm-provider/prompt";
import {RunActor} from "domain/span/types";

export class OpenaiApiProvider implements LlmProvider {
    private client: OpenAI;
    private model = "gpt-5-mini"; //"gpt-4.1-mini" / gpt-5-mini / gpt-4.1 / gpt-5.1 и т.д.
    private effort: 'none' | 'minimal' | 'low' | 'medium' | 'high' = 'low';

    constructor(config: { openaiApiKey: string }) {
        this.client = new OpenAI({
            apiKey: config.openaiApiKey,
        });
    }

    public async findMatches(inputText: string, config: ProcessingConfig): Promise<RunResult> {
        const REDACTION_TEXT_CONFIG = this.buildRedactionSchema()

        const llmChoices = config.llmKinds.filter(kind => kind.enabled).map(kind => kind.kind);

        const userPayload = {
            text: inputText,
            custom_queries: [...llmChoices, ...config.customQueries],
        };

        const startTime = Date.now();
        console.log(`Started llm request at ${new Date().toISOString()}`);
        const response = await this.client.responses.parse<any, RedactionResult>({
            model: this.model,
            instructions: systemPromptV6,
            input: [
                {
                    role: "user",
                    content: [
                        {
                            type: "input_text",
                            text: JSON.stringify(userPayload, null, 2),
                        },
                    ],
                },
            ],
            text: REDACTION_TEXT_CONFIG,
            reasoning: { effort: this.effort }
        });
        console.log(`Finished llm request at ${new Date().toISOString()}`);
        const endTime = Date.now();
        const timeTaken = endTime - startTime;

        const rawObjects = response.output_parsed?.entities ?? [];

        const resultSpans: Span[] = [];

        rawObjects.forEach((value) => {
            if (this.isValidSpan(value)) {
                const span = new Span({
                    ...value,
                    start: value.start || 0,
                    end: value.end || 0,
                    actor: RunActor.Llm,
                })
                this.validateIndeces(inputText, span);
                resultSpans.push(span);
            }
        })
        return { spans: resultSpans, stats: { timeTaken, usage: response.usage } };
    }

    private isValidSpan(value: object): value is SpanModel {
        return ('kind' in value &&
            // 'start' in value &&
            // 'end' in value &&
            'before' in value &&
            'after' in value &&
            'confidence' in value);
    }

    private buildRedactionSchema()  {
        return {
            format: {
                type: "json_schema" as const,
                name: "redaction_entities",
                strict: true,
                schema: {
                    type: "object",
                    properties: {
                        entities: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    kind: {type: "string"},
                                    // start: {type: "integer"},
                                    // end: {type: "integer"},
                                    before: {type: "string"},
                                    after: {type: "string"},
                                    confidence: {
                                        type: "number",
                                        minimum: 0,
                                        maximum: 1,
                                    },
                                },
                                required: ["kind",
                                    // "start", "end",
                                    "before", "after", "confidence"],
                                additionalProperties: false,
                            },
                        },
                    },
                    required: ["entities"],
                    additionalProperties: false,
                },
            }
        }
    }

    private validateIndeces(inputText: string, span: Span): Span {
        const slice = inputText.slice(span.start, span.end);

        if (slice !== span.before) {
            span.start = inputText.indexOf(span.before)
            span.end = span.start + span.before.length;

        }

        return span;
    }
}

export type RedactionEntity = {
    kind: string;
    start: number;
    end: number;
    after: string;
    confidence: number;
};

export type RedactionResult = {
    entities: RedactionEntity[];
};


