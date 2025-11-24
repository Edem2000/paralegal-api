import {Module} from "@nestjs/common";
import {CardRule, EmailRule, PassportRule, PhoneRule, Rule, TinRule} from "domain/_processor/rules";
import {Symbols} from "di/common";

@Module({
    providers: [
        PhoneRule,
        EmailRule,
        CardRule,
        PassportRule,
        TinRule,

        {
            provide: Symbols.domain.rules.common,
            useFactory: (
                phone: PhoneRule,
                email: EmailRule,
                card: CardRule,
                passport: PassportRule,
                tin: TinRule,
            ): Rule[] => {
                return [card, passport, tin, email, phone];
            },
            inject: [CardRule, PassportRule, TinRule, EmailRule, PhoneRule],
        },
    ],
    exports: [Symbols.domain.rules.common],
})
export class RulesModule {}
