import {KindMaskConfig, ProcessingConfig} from "domain/_processor/processing-config/processing-config";
import {allRuleKinds, RuleKind} from "domain/_processor/rules";
import {MaskingMode} from "domain/_processor/processing-config/types";

export interface ProcessingConfigService {
    buildConfig(choices: RuleKind[], maskingMode: MaskingMode, customQueries: string[]): ProcessingConfig;
}

export class ProcessingConfigServiceImpl implements ProcessingConfigService {
    private allRuleKinds: RuleKind[] = allRuleKinds;

    buildConfig(choices: RuleKind[], maskingMode: MaskingMode, customQueries: string[]): ProcessingConfig {

        const kinds: KindMaskConfig[] = this.allRuleKinds.map((kind) => ({
            kind,
            enabled: choices.includes(kind),
            maskingMode: maskingMode,
        }));

        return {
            kinds,
            customQueries,
            maskingMode,
        };
    }
}