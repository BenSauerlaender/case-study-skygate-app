import type { FormInputs } from "./types";
import * as EmailValidator from "email-validator";

export type Validators = Map<keyof FormInputs, Validator[]>;
export type Validator = (input: any) => true | string;

export function getValidators(
  password: string | undefined = undefined
): Validators {
  const validators: Validators = new Map();
  validators.set("email", [required, isEmail, maxLength(99)]);
  validators.set("email", [required, isEmail, maxLength(99)]);
  validators.set("name", [required, isWords, minLength(2)]);
  validators.set("postcode", [required, isNumber, length(5)]);
  validators.set("city", [required, isWords, minLength(2)]);
  validators.set("phone", [required, isPhone, minDigit(8), maxDigit(15)]);
  validators.set("password", [
    required,
    minLength(8),
    maxLength(49),
    isPassword,
    containOneNumber,
    containOneUpper,
    containOneLower,
  ]);
  validators.set("readLegals", [required, isChecked]);
  if (password !== undefined) {
    validators.set("passwordRepeat", [required, equals(password)]);
  }
  return validators;
}

const i18n_prefix = "validationErrorMessages.";

export const required: Validator = (x: any): true | string => {
  switch (typeof x) {
    case "string":
      if (x.length > 0) return true;
      break;
    case "boolean":
      return true;
  }
  return i18n_prefix + "required";
};

export function maxLength(max: number): Validator {
  return (x: any): true | string => {
    if (required(x) !== true) return true;
    if (typeof x === "string" && x.length <= max) return true;
    return i18n_prefix + `maxLength.${max}`;
  };
}
export function minLength(min: number): Validator {
  return (x: any): true | string => {
    if (required(x) !== true) return true;
    if (typeof x === "string" && x.length >= min) return true;
    return i18n_prefix + `minLength.${min}`;
  };
}
export function maxDigit(max: number): Validator {
  return (x: any): true | string => {
    if (required(x) !== true) return true;
    if (typeof x === "string" && x.replace(/[^0-9]/g, "").length <= max)
      return true;
    return i18n_prefix + `maxDigit.${max}`;
  };
}
export function minDigit(min: number): Validator {
  return (x: any): true | string => {
    if (required(x) !== true) return true;
    if (typeof x === "string" && x.replace(/[^0-9]/g, "").length >= min)
      return true;
    return i18n_prefix + `minDigit,${min}`;
  };
}
export function length(length: number): Validator {
  return (x: any): true | string => {
    if (required(x) !== true) return true;
    if (minLength(length)(x) === true && maxLength(length)(x) === true)
      return true;
    return i18n_prefix + `length,${length}`;
  };
}
export function equals(c: any): Validator {
  return (x: any): true | string => {
    if (required(x) !== true) return true;
    if (x === c) return true;
    return i18n_prefix + "needMatch";
  };
}
export const isChecked: Validator = (x: any): true | string => {
  if (equals(true)(x) === true) return true;
  return i18n_prefix + "isChecked";
};

export const isEmail: Validator = (x: any): true | string => {
  if (required(x) !== true) return true;
  if (typeof x === "string" && EmailValidator.validate(x) === true) return true;
  return i18n_prefix + "needToBeValid";
};

//AB HIER!!!!
export const isNumber: Validator = helpers.withMessage(
  i18n_prefix + "needToBeNumber",
  helpers.regex(/^[0-9]*$/)
);

export const isWords: Validator = helpers.withMessage(
  i18n_prefix + "needToBeWords",
  helpers.regex(/^[a-zA-ZÄÖÜäöüß ]*$/)
);

export const isPhone: Validator = helpers.withMessage(
  i18n_prefix + "needToBePhone",
  helpers.regex(/^[0-9 +\-()\/.x]*$/)
);

export const isPassword: Validator = helpers.withMessage(
  i18n_prefix + "needToBePassword",
  helpers.regex(/^[a-zA-ZÄÖÜäöüß0-9#?!@$%^&.*\-+]*$/)
);
export const containOneNumber: Validator = helpers.withMessage(
  i18n_prefix + "containOneNumber",
  helpers.regex(/[0-9]+/)
);

export const containOneUpper: Validator = helpers.withMessage(
  i18n_prefix + "containOneUpper",
  helpers.regex(/[A-ZÄÖÜ]+/)
);

export const containOneLower: Validator = helpers.withMessage(
  i18n_prefix + "containOneLower",
  helpers.regex(/[a-zäöü]+/)
);
