import {Module} from "@nestjs/common";
import {Rule} from "domain/_processor/rules";
import {Symbols} from "di/common";
import {ProcessingConfigService, ProcessingConfigServiceImpl} from "domain/_processor/processing-config/service";

@Module({
    imports: [],
    providers: [
        {
            provide: Symbols.domain.utils.processingConfig,
            useFactory: (): ProcessingConfigService => {
                return new ProcessingConfigServiceImpl();
            },
            inject: [],
        },
    ],
    exports: [Symbols.domain.utils.processingConfig],
})
export class UtilsModule {}
