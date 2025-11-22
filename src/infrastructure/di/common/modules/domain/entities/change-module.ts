import {Module} from "@nestjs/common";
import {Symbols} from "di/common";
import {ChangeService, ChangeServiceImpl} from "domain/change/service";

@Module({
    imports: [],
    providers: [
        {
            provide: Symbols.domain.change.service,
            useFactory: (): ChangeService => {
                return new ChangeServiceImpl();
            },
            inject: [],
        },
    ],
    exports: [Symbols.domain.change.service,],
})
export class ChangeModule {}
