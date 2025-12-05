import type {ProcessingConfig} from "domain/_processor/processing-config";
import {Span, SpanModel} from "domain/span/span";
import type {LlmProvider} from "domain/_processor";
import {GoogleGenAI} from "@google/genai";
import {systemPrompt} from "infrastructure/gateways/llm-provider/prompt";
import {RunActor} from "domain/span/types";

export class GeminiApiProvider implements LlmProvider {
    private client: GoogleGenAI;
    private model = "gemini-2.5-flash";
    //other options: "gemini-3-pro-preview"

    constructor(config: { geminiApiKey: string }) {
        console.log("GeminiApiProvider", config);

        this.client = new GoogleGenAI({
            apiKey: config.geminiApiKey,
        });
    }

    public async findMatches(inputText: string, config: ProcessingConfig): Promise<Span[]> {
        const response = await this.client.models.generateContent({
            model: this.model,
            contents: `text to process: ${inputText}; queries to search: ${config.customQueries.join(', ')}; maskingMode: ${config.maskingMode}`,
            config: {
                responseMimeType: "application/json",
                systemInstruction: systemPrompt
            }
        });
        const rawObjects = response.text ? this.parseResponse(response.text) : [];

        console.log(rawObjects);

        const resultSpans: Span[] = [];

        rawObjects.forEach((value) => {
            console.log(this.isValidSpan(value), value)
            if(this.isValidSpan(value)) {
                const span = new Span({
                    ...value,
                    actor: RunActor.Llm,
                })
                resultSpans.push(span);
            }
        })
        return resultSpans;
    }

    private parseResponse(llmResponse: string): object[] {
        try {
            return JSON.parse(llmResponse)?.entities;
        }
        catch (e) {
            console.error(e);
            return [];
        }
    }

    private isValidSpan(value: object): value is SpanModel {
        return ('kind' in value &&
        'start' in value &&
        'end' in value &&
        'before' in value &&
        'after' in value &&
        'confidence' in value );
    }
}