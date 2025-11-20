import {MaskPolicy} from "domain/_processor/policies/mask-policy";

export class ReadableFullBlockPolicy implements MaskPolicy {
    constructor(private readonly maskStr: string = 'MASKED_DATA') {}

    mask(raw: string): string {
        return `[${this.maskStr}]`;
    }
}