import type { ValidationRule } from "@vuelidate/core";
import {
  required as orgRequired,
  sameAs as orgSameAs,
  helpers,
} from "@vuelidate/validators";

const i18n_prefix = "validationErrorMessages.";

export const required: ValidationRule<any> = helpers.withMessage(
  i18n_prefix + "required",
  orgRequired
);

export const isChecked: ValidationRule<any> = helpers.withMessage(
  i18n_prefix + "needCheck",
  orgSameAs(true)
);
