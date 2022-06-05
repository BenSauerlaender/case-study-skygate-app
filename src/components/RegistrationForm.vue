<script setup lang="ts">
import { ref, type Ref } from "vue";
import { useStore, type User } from "@/stores/store";
import { InvalidPropsError } from "@/helper/errors";
import InputForm from "./InputForm.vue";
import type { ApiResponseStatus } from "@/helper/types";

const store = useStore();

const emailSendTo = ref("");

/**
 * A map that holds for each input-field a list of errorMessages.
 *
 * The errorMessages are path to the i18n messages to show the user
 */
const validationErrorMessageMap: Ref<Map<string, string[]>> = ref(new Map());

const apiResponseStatus: Ref<ApiResponseStatus> = ref(undefined);

/**
 * Event to register the new user (invoked by user-button-click)
 */
const register = (inputs: User) => {
  if (apiResponseStatus.value === "pending") return;

  validationErrorMessageMap.value = new Map();
  apiResponseStatus.value = "pending";

  store
    .registerUser(inputs)
    .then(() => {
      apiResponseStatus.value = "successful";
      emailSendTo.value = inputs.email;
    })
    .catch((err) => {
      if (err instanceof InvalidPropsError) {
        apiResponseStatus.value = undefined;

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
      }
    });
};
</script>

<template>
  <InputForm
    :fields="[
      'email',
      'name',
      'postcode',
      'city',
      'phone',
      'password',
      'passwordRepeat',
      'readLegals',
    ]"
    submitButtonText="sites.register.buttons.register"
    @submitForm="register"
    :externalValidationError="validationErrorMessageMap"
    :responseStatus="apiResponseStatus"
  />
  <br />
  <br />
  <h3 v-if="apiResponseStatus === 'pending'">{{ $t("messages.loading") }}</h3>
  <h3 id="success" v-if="apiResponseStatus === 'successful'">
    {{ $t("sites.register.messages.successful", { email: emailSendTo }) }}
  </h3>
  <h3 id="error" v-if="apiResponseStatus === 'error'">
    {{ $t("messages.connectionError") }}
  </h3>
</template>

<style scoped>
#success {
  color: var(--color-success);
}
#error {
  color: var(--color-error);
}
</style>
