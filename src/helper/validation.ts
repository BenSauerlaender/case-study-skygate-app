import type {
  ErrorObject,
  ValidationRule,
  ValidationRuleWithoutParams,
} from "@vuelidate/core";
import { required as originalRequired, helpers } from "@vuelidate/validators";

/**
 * A list of supported property names
 */
const properties = [
  { name: "email", description: "Email", rules: {} },
  { name: "name", description: "Vor- und Zuname", rules: {} },
  { name: "postcode", description: "PLZ", rules: {} },
  { name: "city", description: "Ort", rules: {} },
  { name: "phone", description: "Telefonnummer", rules: {} },
  { name: "newPassword", description: "Passwort", rules: {} },
  { name: "newPasswordRepeat", description: "Passwort wiederholen", rules: {} },
  {
    name: "readLegals",
    description: "Nutzungsbedingungen und Datenschutz",
    rules: {},
  },
] as const;
export type PropertyNames = typeof properties[number]["name"];

export function getValidationObject(props: PropertyNames[]) {
  return {
    prop,
  };
}

export const required: ValidationRule<any> = helpers.withMessage(
  "INPUT_VALIDATION_ERROR_REQUIRED",
  originalRequired
);
