import fs from "node:fs";
import path from "node:path";
import axios from "axios";
import {RunActor} from "domain/change/types";
import type {ProcessingConfig} from "domain/_processor/processing-config";
import {Span} from "domain/span/span";
import type {LlmProvider} from "domain/_processor";

const SYSTEM_PROMPT_PATH = path.resolve(__dirname, "system_prompt.txt");
const SYSTEM_PROMPT = loadSystemPrompt();

function loadSystemPrompt(): string {
    try {
        return fs.readFileSync(SYSTEM_PROMPT_PATH, "utf8");
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to load system prompt from ${SYSTEM_PROMPT_PATH}: ${message}`);
    }
}

const DEFAULT_HOST = "http://127.0.0.1:1234/v1/chat/completions";
const DEFAULT_MODEL = "google/gemma-3-12b";
const DEFAULT_TEMPERATURE = 0.3;
const DEFAULT_MAX_TOKENS = 2048;

export class LlmProviderImpl implements LlmProvider {
    public async findMatches(inputText: string, config: ProcessingConfig): Promise<Span[]> {
        const hostEnv = process.env.LMSTUDIO_HOST;
        const endpoint = hostEnv
            ? (hostEnv.endsWith("/v1/chat/completions") ? hostEnv : `${hostEnv}/v1/chat/completions`)
            : DEFAULT_HOST;
        const model = process.env.LMSTUDIO_MODEL || DEFAULT_MODEL;
        const temperature = this.parseNumber(process.env.LMSTUDIO_TEMPERATURE, DEFAULT_TEMPERATURE);
        const maxTokens = this.parseNumber(process.env.LMSTUDIO_MAX_TOKENS, DEFAULT_MAX_TOKENS);

        const enabledChoices = (config.kinds || [])
            .filter((k) => k.enabled)
            .map((k) => k.kind)
            .join(", ") || "none";
        const customQueries = (config.customQueries || []).join(", ") || "none";

        const messages = [
            { role: "system", content: SYSTEM_PROMPT },
            {
                role: "user",
                content: [
                    `TEXT:\n${inputText}`,
                    `regex_categories: ${enabledChoices}`,
                    `custom_queries: ${customQueries}`,
                    `masking_mode: ${config.maskingMode || "unknown"}`,
                ].join("\n\n"),
            },
        ];

        try {
            const response = await axios.post(endpoint, {
                model,
                messages,
                temperature,
                max_tokens: maxTokens,
                response_format: { type: "text" },
                stream: false,
            });

            const rawContent = response?.data?.choices?.[0]?.message?.content;
            if (!rawContent || typeof rawContent !== "string") {
                return [];
            }

            const cleaned = this.stripCodeFences(rawContent.trim());
            const parsed = this.safeParse(cleaned);
            const entities = Array.isArray(parsed)
                ? parsed
                : Array.isArray(parsed?.entities)
                    ? parsed.entities
                    : [];

            if (!Array.isArray(entities)) {
                return [];
            }

            const spans: Span[] = [];
            for (const ent of entities) {
                const start = this.toNumber(ent?.start);
                const end = this.toNumber(ent?.end);
                if (start === null || end === null || start < 0 || end <= start || end > inputText.length) {
                    continue;
                }

                const before = inputText.slice(start, end);
                if (!before) continue;

                const rawKind = typeof ent?.kind === "string" ? ent.kind : "unknown";
                const normalizedKind = rawKind.toLowerCase();
                const after = `[${normalizedKind.toUpperCase()}]`;
                const confidence = typeof ent?.confidence === "number" ? ent.confidence : 1.0;

                spans.push(new Span({
                    kind: normalizedKind as any,
                    start,
                    end,
                    before,
                    after,
                    actor: RunActor.Llm,
                    confidence,
                }));
            }

            return spans;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error("LM Studio request failed", error);
            return [];
        }
    }

    private stripCodeFences(content: string): string {
        if (!content.startsWith("```")) {
            return content;
        }

        const fence = content.startsWith("```json") ? "```json" : "```";
        const startIndex = content.indexOf(fence) + fence.length;
        const endIndex = content.lastIndexOf("```");
        if (endIndex > startIndex) {
            return content.slice(startIndex, endIndex).trim();
        }
        return content.replace(/```/g, "").trim();
    }

    private safeParse(body: string): any {
        try {
            return JSON.parse(body);
        } catch {
            return null;
        }
    }

    private parseNumber(value: string | undefined, fallback: number): number {
        const parsed = value ? Number(value) : NaN;
        return Number.isFinite(parsed) ? parsed : fallback;
    }

    private toNumber(val: unknown): number | null {
        if (typeof val === "number" && Number.isFinite(val)) return val;
        if (typeof val === "string") {
            const parsed = Number(val);
            if (Number.isFinite(parsed)) return parsed;
        }
        return null;
    }
}
