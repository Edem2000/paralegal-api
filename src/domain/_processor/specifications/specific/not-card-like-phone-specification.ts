import {Specification} from '../specification';

export class NotCardLikePhoneSpecification implements Specification<string> {
    isSatisfiedBy(value: string): boolean {
        const digits = value.replace(/\D/g, '');

        if (digits.length !== 12) {
            return true;
        }

        const trimmed = value.trim();

        // Ensure it's not three 4-digit blocks
        if (/^\d{4}([ -]\d{4}){2}$/.test(trimmed)) {
            return false;
        }

        return true;
    }
}
