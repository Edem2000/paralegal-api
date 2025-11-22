import type {MaskPolicy} from "domain/_processor/policies/mask-policy";

export class KeepHeadAndTailPolicy implements MaskPolicy {
    constructor(
        private readonly headLength: number = 2,
        private readonly tailLength: number = 2,
        private readonly maskChar: string = '*',
    ) {}

    mask(raw: string): string {
        const len = raw.length;

        // Если строка слишком короткая — маскируем всё
        if (len <= this.headLength + this.tailLength) {
            return this.maskChar.repeat(len);
        }

        const head = raw.slice(0, this.headLength);
        const tail = raw.slice(-this.tailLength);
        const middleMask = this.maskChar.repeat(len - this.headLength - this.tailLength);

        return head + middleMask + tail;
    }
}