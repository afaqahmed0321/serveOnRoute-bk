import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsPhoneOrEmail(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string): void {
    registerDecorator({
      name: 'isPhoneOrEmail',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments | any) {
          const phone = args.object['phone'];
          const email = args.object['email'];
          return (phone && !email) || (email && !phone) || (phone && email);
        },
        defaultMessage(args: ValidationArguments) {
          return `Either a phone number or an email address is required.`;
        },
      },
    });
  };
}
