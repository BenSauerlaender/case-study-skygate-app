import type { FormInputs } from "./types";
import * as EmailValidator from "email-validator";

//A Map that stores a list of validators for each form input field
export type Validators = Map<keyof FormInputs, Validator[]>;

/***
 * A Validator is a function that validates a specific aspect about a variable.
 * If the validation is successful it returns true
 * Otherwise a string that point to a i18n-error-message
 */
export type Validator = (input: any) => true | string;

//Constructs and returns a Validators map
export function getAllValidators(
  password: string | undefined = undefined
): Validators {
  //map to return
  const validators: Validators = new Map();

  validators.set("email", [isEmail, maxLength(99)]);
  validators.set("email", [isEmail, maxLength(99)]);
  validators.set("name", [isWords, minLength(2)]);
  validators.set("postcode", [isNumber, length(5)]);
  validators.set("city", [isWords, minLength(2)]);
  validators.set("phone", [isPhone, minDigit(8), maxDigit(15)]);
  validators.set("oldPassword", []);
  validators.set("password", [
    minLength(8),
    maxLength(49),
    isPassword,
    containOneNumber,
    containOneUpper,
    containOneLower,
  ]);
  validators.set("readLegals", [isChecked]);

  if (password !== undefined) {
    validators.set("passwordRepeat", [equals(password)]);
  }

  return validators;
}

const i18n_prefix = "validationErrorMessages.";

//validates if a variable can be considered as 'is set'
export const checkRequired: Validator = (x: any): true | string => {
  switch (typeof x) {
    case "string":
      if (x.length > 0) return true;
      break;
    case "boolean":
      return true;
  }
  return i18n_prefix + "required";
};

function maxLength(max: number): Validator {
  return (x: any): true | string => {
    if (typeof x === "string" && x.length <= max) return true;
    return i18n_prefix + `maxLength.${max}`;
  };
}
function minLength(min: number): Validator {
  return (x: any): true | string => {
    if (typeof x === "string" && x.length >= min) return true;
    return i18n_prefix + `minLength.${min}`;
  };
}
function maxDigit(max: number): Validator {
  return (x: any): true | string => {
    if (typeof x === "string" && x.replace(/[^0-9]/g, "").length <= max)
      return true;
    return i18n_prefix + `maxDigit.${max}`;
  };
}
function minDigit(min: number): Validator {
  return (x: any): true | string => {
    if (typeof x === "string" && x.replace(/[^0-9]/g, "").length >= min)
      return true;
    return i18n_prefix + `minDigit.${min}`;
  };
}
function length(length: number): Validator {
  return (x: any): true | string => {
    if (minLength(length)(x) === true && maxLength(length)(x) === true)
      return true;
    return i18n_prefix + `length.${length}`;
  };
}
function equals(c: any): Validator {
  return (x: any): true | string => {
    if (x === c) return true;
    return i18n_prefix + "needMatch";
  };
}
const isChecked: Validator = (x: any): true | string => {
  if (equals(true)(x) === true) return true;
  return i18n_prefix + "needCheck";
};

const isEmail: Validator = (x: any): true | string => {
  if (typeof x === "string" && EmailValidator.validate(x) === true) return true;
  return i18n_prefix + "needToBeValid";
};

const isNumber: Validator = (x: any): true | string => {
  if (typeof x === "string" && x.match(/^[0-9]*$/)) return true;
  return i18n_prefix + "needToBeNumber";
};

const isWords: Validator = (x: any): true | string => {
  if (typeof x === "string" && x.match(/^[a-zA-ZÄÖÜäöüß ]*$/)) return true;
  return i18n_prefix + "needToBeWords";
};

const isPhone: Validator = (x: any): true | string => {
  if (typeof x === "string" && x.match(/^[0-9 +\-()\/.x]*$/)) return true;
  return i18n_prefix + "needToBePhone";
};

const isPassword: Validator = (x: any): true | string => {
  if (typeof x === "string" && x.match(/^[a-zA-ZÄÖÜäöüß0-9#?!@$%^&.*\-+]*$/))
    return true;
  return i18n_prefix + "needToBePassword";
};

const containOneNumber: Validator = (x: any): true | string => {
  if (typeof x === "string" && x.match(/[0-9]+/)) return true;
  return i18n_prefix + "containOneNumber";
};

const containOneUpper: Validator = (x: any): true | string => {
  if (typeof x === "string" && x.match(/[A-ZÄÖÜ]+/)) return true;
  return i18n_prefix + "containOneUpper";
};

const containOneLower: Validator = (x: any): true | string => {
  if (typeof x === "string" && x.match(/[a-zäöü]+/)) return true;
  return i18n_prefix + "containOneLower";
};
