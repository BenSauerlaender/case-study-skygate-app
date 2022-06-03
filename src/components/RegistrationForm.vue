<script setup lang="ts">
import ErrorLog from "@/components/ErrorLog.vue";
import { computed, ref, type Ref } from "vue";
import useVuelidate from "@vuelidate/core";
import {
  required,
  isChecked,
  isEmail,
  maxSize,
  minSize,
  maxDigit,
  minDigit,
  isWords,
  isNumber,
  size,
  equals,
  isPhone,
  isPassword,
  containOneNumber,
  containOneUpper,
  containOneLower,
} from "@/helper/validators";
import { useStore } from "@/stores/store";
import { InvalidPropsError } from "@/helper/errors";
import type { RegistrationProps } from "@/helper/backendInterface";

const store = useStore();

type FormPropsType = RegistrationProps & {
  passwordRepeat: string;
  readLegals: boolean;
};
const initialProps: FormPropsType = {
  email: "",
  name: "",
  postcode: "",
  city: "",
  phone: "",
  password: "",
  passwordRepeat: "",
  readLegals: false,
};
/**
 * Information the user inserts to the register form
 */
const formProps: Ref<FormPropsType> = ref({ ...initialProps });

const emailSendTo = ref("");

function resetFormProps() {
  Object.assign(formProps, initialProps);
}
const formPropKeys = computed(() => {
  return Object.keys(formProps);
});
//need a separate computed property for the validation
const password = computed(() => {
  return formProps.value.password;
});
/**
 * Validation rules that need to match to register
 */
const validationRules = {
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
  passwordRepeat: { required, equals: equals(password) },
  readLegals: { required, isChecked },
};

/**
 * A map that holds for each input-field a list of errorMessages.
 *
 * The errorMessages are path to the i18n messages to show the user
 */
const validationErrorMessageMap: Ref<Map<string, string[]>> = ref(new Map());

/**
 * The Vuelidation object to validate the input
 */
const v$ = useVuelidate(validationRules, formProps);

const apiResponseStatus: Ref<"pending" | "successful" | "error" | null> =
  ref(null);
/**
 * Event to register the new user (invoked by user-button-click)
 */
const register = async (event: Event) => {
  if (apiResponseStatus.value === "pending") return;

  validationErrorMessageMap.value = new Map();
  //validate the input
  const result = await v$.value.$validate();
  if (!result) {
    //write all validation errors in validationErrorMessageMap
    v$.value.$errors.forEach((error) => {
      let errorList =
        validationErrorMessageMap.value.get(error.$property) ?? [];
      errorList.push(
        typeof error.$message === "string"
          ? error.$message
          : error.$message.value
      );
      validationErrorMessageMap.value.set(error.$property, errorList);
    });
    return;
  }
  apiResponseStatus.value = "pending";

  store
    .registerUser(formProps.value)
    .then(() => {
      apiResponseStatus.value = "successful";
      emailSendTo.value = formProps.value.email;
      resetFormProps();
    })
    .catch((err) => {
      if (err instanceof InvalidPropsError) {
        apiResponseStatus.value = null;

        const invalidPropMap = err.invalidProps;

        Object.keys(invalidPropMap).forEach((key: string) => {
          if (key === "email" && invalidPropMap[key][0] === "IS_TAKEN") {
            validationErrorMessageMap.value.set("email", [
              "validationErrorMessages.isTaken",
            ]);
          } else {
            validationErrorMessageMap.value.set(key, [
              "validationErrorMessages.needToBeValid",
            ]);
          }
        });
      } else {
        apiResponseStatus.value = "error";
        resetFormProps();
      }
    });
};
</script>

<template>
  <div id="frame">
    <div id="inputs">
      <div v-for="(value, key) in formProps">
        <!-- Special case for the checkbox -->
        <template v-if="key === 'readLegals'">
          <br />
          <input
            type="checkbox"
            id="{{key}}"
            v-model="formProps.readLegals"
            :class="{ invalid: validationErrorMessageMap.has(key) }"
          />
          <label for="{{key}}">
            <i18n-t keypath="inputFields.readLegals.description" tag="i">
              <template v-slot:termsOfUse>
                <RouterLink to="/terms-of-use">{{
                  $t("sites.termsOfUse.name")
                }}</RouterLink>
              </template>
              <template v-slot:privacy>
                <RouterLink to="/privacy">{{
                  $t("sites.privacy.long")
                }}</RouterLink>
              </template>
            </i18n-t>
          </label>
        </template>
        <!-- Normal behavior on text-input-fields -->
        <template v-else>
          <!-- Label for field -->
          <label for="{{key}}">{{ $t("inputFields." + key + ".label") }}</label>
          <br />
          <!-- For the Password fields -->
          <template v-if="key === 'password' || key === 'passwordRepeat'">
            <input
              type="password"
              id="{{key}}"
              v-model="formProps[key]"
              :class="{ invalid: validationErrorMessageMap.has(key) }"
            />
          </template>
          <!-- For all other fields -->
          <template v-else>
            <input
              id="{{key}}"
              v-model="formProps[key]"
              :class="{ invalid: validationErrorMessageMap.has(key) }"
            />
          </template>
          <br
        /></template>
      </div>
    </div>
    <ErrorLog
      v-if="validationErrorMessageMap.size > 0"
      :errorMap="validationErrorMessageMap"
    />
  </div>

  <button @click="register">{{ $t("sites.register.buttons.register") }}</button>
  <br />
  <br />
  <div v-if="apiResponseStatus === 'pending'">
    <h3>{{ $t("messages.loading") }}</h3>
  </div>
  <div id="success" v-if="apiResponseStatus === 'successful'">
    <h3>
      {{ $t("sites.register.messages.successful", { email: emailSendTo }) }}
    </h3>
  </div>
  <div id="error" v-if="apiResponseStatus === 'error'">
    <h3>{{ $t("messages.connectionError") }}</h3>
  </div>
</template>

<style scoped>
.invalid {
  outline: solid var(--color-invalid-input);
}

/* To add space between checkbox and text*/
input {
  margin-right: 10px;
}
#frame {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
#success {
  color: var(--color-success);
}
#error {
  color: var(--color-error);
}
</style>
