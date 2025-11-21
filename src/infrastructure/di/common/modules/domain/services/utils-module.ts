import {Module} from "@nestjs/common";
import {RulesModule} from "di/common/modules/domain/services/rule-module";
import {Rule} from "domain/_processor/rules";
import {Symbols} from "di/common";
import {AlgorithmicMatcherImpl, MaskingEngineImpl} from "domain/_processor";
import {ProcessingConfigService, ProcessingConfigServiceImpl} from "domain/_processor/processing-config/service";

@Module({
    imports: [],
    providers: [
        {
            provide: Symbols.domain.utils.processingConfig,
            useFactory: (rules: Rule[]): ProcessingConfigService => {
                return new ProcessingConfigServiceImpl();
            },
            inject: [],
        },
    ],
    exports: [Symbols.domain.utils.processingConfig],
})
export class UtilsModule {}
