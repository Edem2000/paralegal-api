import {Module} from "@nestjs/common";
import {RulesModule} from "di/common/modules/domain/services/rule-module";
import {Rule} from "domain/_processor/rules";
import {Symbols} from "di/common";
import {
    AlgorithmicMatcher,
    AlgorithmicMatcherImpl,
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
                merger: Merger,
                masker: Masker,
                changeService: ChangeService,
                ): MaskingEngine => {
                return new MaskingEngineImpl(algorithmMatcher, merger, masker, changeService);
            },
            inject: [
                Symbols.domain.engines.algorithmic,
                Symbols.domain.engines.merger,
                Symbols.domain.engines.masker,
                Symbols.domain.change.service,
            ],
        },

        // LlmEngine можно просто как класс, либо тоже через фабрику
        // {
        //     provide: LlmEngine,
        //     useFactory: () => {
        //         // сюда можно будет передать настройки LLM (endpoint, modelName, ...)
        //         return new LlmEngine();
        //     },
        // },
    ],
    exports: [Symbols.domain.engines.algorithmic, Symbols.domain.engines.masker, Symbols.domain.engines.maskingEngine],
})
export class EnginesModule {}
