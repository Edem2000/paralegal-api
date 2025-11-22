import {Module} from "@nestjs/common";
import {Symbols} from "di/common";
import {ChangeService, ChangeServiceImpl} from "domain/change/service";
import {RealmModule} from "di/common/modules/infrastructure/db/realm-module";
import {RealmService} from "data";
import {ChangeRepository} from "domain/change/repository";
import {ChangeRepositoryImpl} from "data/mongo/repositories/change-repository";

@Module({
    imports: [RealmModule],
    providers: [
        {
            provide: Symbols.domain.change.repository,
            useFactory: (realmService: RealmService): ChangeRepository => {
                return new ChangeRepositoryImpl(realmService);
            },
            inject: [
                Symbols.infrastructure.db.realm
            ],
        },
        {
            provide: Symbols.domain.change.service,
            useFactory: (changeRepository: ChangeRepository): ChangeService => {
                return new ChangeServiceImpl(changeRepository);
            },
            inject: [
                Symbols.domain.change.repository
            ],
        },
    ],
    exports: [Symbols.domain.change.repository, Symbols.domain.change.service,],
})
export class ChangeModule {}
