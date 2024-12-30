import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function RequireBothIfOneHasValue(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string): void {
    registerDecorator({
      name: 'requireBothIfOneHasValue',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments | any) {
          const startDate = args.object['startDate'];
          const endDate = args.object['endDate'];
          return (startDate && endDate) || (!startDate && !endDate);
        },
        defaultMessage(args: ValidationArguments) {
          return `Both start date and end date are required if one of them has a value.`;
        },
      },
    });
  };
}
