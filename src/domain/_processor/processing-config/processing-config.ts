import {RuleKind} from "domain/_processor/rules";
import {MaskingMode} from "domain/_processor/processing-config";

export interface KindMaskConfig {
    kind: RuleKind,
    enabled: boolean,
    maskingMode: MaskingMode,
}

export interface ProcessingConfig {
    kinds: KindMaskConfig[],
    llmKinds: KindMaskConfig[],
    customQueries: string[],
    maskingMode: MaskingMode,
}