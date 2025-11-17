import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { Types } from 'mongoose';

export function IsObjectId(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isObjectId',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, _args: ValidationArguments) {
                    return typeof value === 'string' && Types.ObjectId.isValid(value);
                },
                defaultMessage(_args: ValidationArguments) {
                    return '$property must be a valid MongoDB ObjectId';
                },
            },
        });
    };
}
