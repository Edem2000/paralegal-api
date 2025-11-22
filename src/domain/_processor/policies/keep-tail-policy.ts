import type {MaskPolicy} from "domain/_processor/policies/mask-policy";

export class KeepTailPolicy implements MaskPolicy {
    constructor(
        private readonly tailLength: number = 2,
        private readonly maskChar: string = '*',
    ) {}

    mask(raw: string): string {
        if (raw.length <= this.tailLength) {
            return this.maskChar.repeat(raw.length);
        }
        const tail = raw.slice(-this.tailLength);
        const headMask = this.maskChar.repeat(raw.length - this.tailLength);
        return headMask + tail;
    }
}