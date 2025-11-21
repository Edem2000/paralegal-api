import {Module} from "@nestjs/common";
import {RulesModule} from "di/common/modules/domain/services/rule-module";
import {Rule} from "domain/_processor/rules";
import {Symbols} from "di/common";
import {AlgorithmicMatcher, AlgorithmicMatcherImpl, MaskingEngine, MaskingEngineImpl} from "domain/_processor";

@Module({
    imports: [RulesModule],
    providers: [
        {
            provide: Symbols.domain.engines.algorithmic,
            useFactory: (rules: Rule[]): AlgorithmicMatcher => {
                return new AlgorithmicMatcherImpl(rules);
            },
            inject: [Symbols.domain.rules.common],
        },
        {
            provide: Symbols.domain.engines.masking,
            useFactory: (algorithmMatcher: AlgorithmicMatcher): MaskingEngine => {
                return new MaskingEngineImpl(algorithmMatcher);
            },
            inject: [Symbols.domain.engines.algorithmic],
        },

        // LlmEngine можно просто как класс, либо тоже через фабрику
        // {
        //     provide: LlmEngine,
        //     useFactory: () => {
        //         // сюда можно будет передать настройки LLM (endpoint, modelName, ...)
        //         return new LlmEngine();
        //     },
        // },

        // Merge + Masking пока простые сервисы
        // {
        //     provide: Symbols.domain.engines.merger,
        //     useFactory: () => new MergeEngineService(),
        // },
        // {
        //     provide: Symbols.domain.engines.masking,
        //     useFactory: () => new MaskingEngineImpl(),
        // },
    ],
    exports: [Symbols.domain.engines.algorithmic, Symbols.domain.engines.masking],
})
export class EnginesModule {}
