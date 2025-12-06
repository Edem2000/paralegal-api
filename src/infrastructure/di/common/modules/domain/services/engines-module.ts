import {Module} from "@nestjs/common";
import {RulesModule} from "di/common/modules/domain/services/rule-module";
import {Rule} from "domain/_processor/rules";
import {Symbols} from "di/common";
import {
    AlgorithmicMatcher,
    AlgorithmicMatcherImpl, LlmProvider,
    Masker,
    MaskerImpl,
    MaskingEngine,
    MaskingEngineImpl,
    Merger,
    MergerImpl
} from "domain/_processor";
import {RulePriority} from "domain/_processor/rules/priority";
import {ChangeModule} from "di/common/modules/domain/entities/change-module";
import {ChangeService} from "domain/change/service";
import {LlmProviderImpl} from "infrastructure/gateways/llm-provider/llm-provider";
import {config, LlmProviderOption} from "infrastructure/config/config";
import {GeminiApiProvider} from "infrastructure/gateways/llm-provider/gemini-api-provider";
import {OpenaiApiProvider} from "infrastructure/gateways/llm-provider/openai-api-provider";

@Module({
    imports: [RulesModule, ChangeModule],
    providers: [
        {
            provide: Symbols.domain.engines.algorithmic,
            useFactory: (rules: Rule[]): AlgorithmicMatcher => {
                return new AlgorithmicMatcherImpl(rules);
            },
            inject: [Symbols.domain.rules.common],
        },
        {
            provide: Symbols.domain.engines.llm,
            useFactory: (): LlmProvider => {
                console.log(config.llm.provider)
                if (config.llm.provider === LlmProviderOption.Gemini) {
                    return new GeminiApiProvider({geminiApiKey: config.llm.geminiApiKey})
                } else if (config.llm.provider === LlmProviderOption.OpenAI) {
                    return new OpenaiApiProvider({openaiApiKey: config.llm.openaiApiKey})
                } else {
                    return new LlmProviderImpl();
                }
            },
            inject: [],
        },
        {
            provide: Symbols.domain.engines.merger,
            useFactory: (
                rules: Rule[],
            ): Merger => {
                return new MergerImpl(rules, RulePriority);
            },
            inject: [Symbols.domain.rules.common],
        },
        {
            provide: Symbols.domain.engines.masker,
            useFactory: (): Masker => {
                return new MaskerImpl();
            },
            inject: [],
        },
        {
            provide: Symbols.domain.engines.maskingEngine,
            useFactory: (
                algorithmMatcher: AlgorithmicMatcher,
                llmProvider: LlmProvider,
                merger: Merger,
                masker: Masker,
                changeService: ChangeService,
                ): MaskingEngine => {
                return new MaskingEngineImpl(algorithmMatcher, llmProvider, merger, masker, changeService);
            },
            inject: [
                Symbols.domain.engines.algorithmic,
                Symbols.domain.engines.llm,
                Symbols.domain.engines.merger,
                Symbols.domain.engines.masker,
                Symbols.domain.change.service,
            ],
        },
    ],
    exports: [Symbols.domain.engines.algorithmic, Symbols.domain.engines.llm, Symbols.domain.engines.masker, Symbols.domain.engines.maskingEngine],
})
export class EnginesModule {}
