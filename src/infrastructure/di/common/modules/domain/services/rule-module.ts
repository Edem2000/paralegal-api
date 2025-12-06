import {Module} from "@nestjs/common";
import {CardRule, EmailRule, PassportRule, PhoneRule, Rule, TinRule} from "domain/_processor/rules";
import {Symbols} from "di/common";
import {PinflRule} from "domain/_processor/rules/specific/pinfl-rule";

@Module({
    providers: [
        PinflRule,
        PhoneRule,
        EmailRule,
        CardRule,
        PassportRule,
        TinRule,

        {
            provide: Symbols.domain.rules.common,
            useFactory: (
                pinfl: PinflRule,
                phone: PhoneRule,
                email: EmailRule,
                card: CardRule,
                passport: PassportRule,
                tin: TinRule,
            ): Rule[] => {
                return [pinfl, card, passport, tin, email, phone];
            },
            inject: [PinflRule, CardRule, PassportRule, TinRule, EmailRule, PhoneRule],
        },
    ],
    exports: [Symbols.domain.rules.common],
})
export class RulesModule {}
