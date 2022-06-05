import type { ValidationRule } from "@vuelidate/core";
import {
  required as orgRequired,
  sameAs,
  helpers,
  email,
  maxLength,
  minLength,
} from "@vuelidate/validators";
import type { FormInputs } from "./types";

export type Validators = { [index: keyof FormInputs]: Validator[] };
export type Validator = (input: any) => true | string;

export function getValidators(
  password: string | undefined = undefined
): Validators {

const validators = new Map();
validators.set("email",[])

{
  email: { required, isEmail, maxChars: maxSize(99) },
  name: { required, isWords, minChars: minSize(2) },
  postcode: { required, isNumber, chars: size(5) },
  city: { required, isWords, minChars: minSize(2) },
  phone: { required, isPhone, minDigit: minDigit(8), maxDigit: maxDigit(15) },
  password: {
    required,
    minChars: minSize(8),
    maxChars: maxSize(49),
    isPassword,
    containOneNumber,
    containOneUpper,
    containOneLower,
  },
  readLegals: { required, isChecked },
});
  if(password !== undefined){
    validators["passwordRepeat"]
  }
  passwordRepeat: { required, equals: equals(password) },
}

const i18n_prefix = "validationErrorMessages.";

export const required: ValidationRule<any> = helpers.withMessage(
  i18n_prefix + "required",
  orgRequired
);

export function maxSize(size: number): ValidationRule<any> {
  return helpers.withMessage(i18n_prefix + `maxSize.${size}`, maxLength(size));
}
export function minSize(size: number): ValidationRule<any> {
  return helpers.withMessage(i18n_prefix + `minSize.${size}`, minLength(size));
}
export function maxDigit(size: number): ValidationRule<any> {
  return helpers.withMessage(
    i18n_prefix + `maxDigit.${size}`,
    (v: string, s, vm) =>
      maxLength(size).$validator(v.replace(/[^0-9]/g, ""), s, vm)
  );
}
export function minDigit(size: number): ValidationRule<any> {
  return helpers.withMessage(
    i18n_prefix + `minDigit.${size}`,
    (v: string, s, vm) => {
      let onlyNumbers = v.replace(/[^0-9]/g, "");
      if (v.length !== 0 && onlyNumbers.length === 0) return false;
      else return minLength(size).$validator(onlyNumbers, s, vm);
    }
  );
}
export function size(size: number): ValidationRule<any> {
  return helpers.withMessage(
    i18n_prefix + `size.${size}`,
    (v, s, vm) =>
      minLength(size).$validator(v, s, vm) &&
      maxLength(size).$validator(v, s, vm)
  );
}
export function equals(c: any): ValidationRule<any> {
  return helpers.withMessage(
    i18n_prefix + "needMatch",
    (v, s, vm) => !helpers.req(v) || sameAs(c).$validator(v, s, vm)
  );
}
export const isChecked: ValidationRule<any> = helpers.withMessage(
  i18n_prefix + "needCheck",
  sameAs(true)
);

export const isEmail: ValidationRule<any> = helpers.withMessage(
  i18n_prefix + "needToBeValid",
  email
);

export const isNumber: ValidationRule<any> = helpers.withMessage(
  i18n_prefix + "needToBeNumber",
  helpers.regex(/^[0-9]*$/)
);

export const isWords: ValidationRule<any> = helpers.withMessage(
  i18n_prefix + "needToBeWords",
  helpers.regex(/^[a-zA-ZÄÖÜäöüß ]*$/)
);

export const isPhone: ValidationRule<any> = helpers.withMessage(
  i18n_prefix + "needToBePhone",
  helpers.regex(/^[0-9 +\-()\/.x]*$/)
);

export const isPassword: ValidationRule<any> = helpers.withMessage(
  i18n_prefix + "needToBePassword",
  helpers.regex(/^[a-zA-ZÄÖÜäöüß0-9#?!@$%^&.*\-+]*$/)
);
export const containOneNumber: ValidationRule<any> = helpers.withMessage(
  i18n_prefix + "containOneNumber",
  helpers.regex(/[0-9]+/)
);

export const containOneUpper: ValidationRule<any> = helpers.withMessage(
  i18n_prefix + "containOneUpper",
  helpers.regex(/[A-ZÄÖÜ]+/)
);

export const containOneLower: ValidationRule<any> = helpers.withMessage(
  i18n_prefix + "containOneLower",
  helpers.regex(/[a-zäöü]+/)
);
