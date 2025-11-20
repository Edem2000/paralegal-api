import {MaskPolicy} from "domain/_processor/policies/mask-policy";

export class FullBlockPolicy implements MaskPolicy {
    constructor(private readonly maskChar: string = '*') {}

    mask(raw: string): string {
        return this.maskChar.repeat(raw.length);
    }
}