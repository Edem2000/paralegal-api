import {Specification} from '../specification';

export class UzbekPhoneSpecification implements Specification<string> {

    isSatisfiedBy(value: string): boolean {
        const digits = value.replace(/\D/g, '');

        // Ensure string satisfies uzbek phone format
        return (/^(998)?(90|91|20|99|77|95|97|88|93|94|50|33|98)\d{7}$/.test(digits));
    }
}
