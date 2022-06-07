<script setup lang="ts">
import { BadPasswordError, InvalidPropsError } from "@/helper/errors";
import type { ApiResponseStatus, FormInputs } from "@/helper/types";
import { useStore } from "@/stores/store";
import { ref, type Ref } from "vue";
import { useRouter } from "vue-router";
import InputForm from "./InputForm.vue";

const props = defineProps<{
  userID: number;
}>();

const router = useRouter();

const store = useStore();

const apiResponseStatus: Ref<ApiResponseStatus> = ref(undefined);
const validationErrorMessageMap: Ref<Map<keyof FormInputs, string[]>> = ref(
  new Map()
);

const changePassword = (inputs: Partial<FormInputs> | null) => {
  if (inputs === null) {
    apiResponseStatus.value = undefined;
    validationErrorMessageMap.value = new Map();
  } else {
    if (apiResponseStatus.value === "pending") return;
    validationErrorMessageMap.value = new Map();
    apiResponseStatus.value = "pending";

    store
      .updateUsersPassword(props.userID, inputs.oldPassword!, inputs.password!)
      .then(() => {
        apiResponseStatus.value = "successful";
        if (props.userID === store.user!.id) {
          setTimeout(() => {
            store.logoutUser();
            router.push("/password-changed").then((x) => {
              console.log(x);
            }).catch(console.log);
          }, 1000);
        }
      })
      .catch((err) => {
        if (err instanceof InvalidPropsError) {
          apiResponseStatus.value = undefined;

          err.invalidProps.forEach((value, key) => {
            validationErrorMessageMap.value.set(key, [
              "validationErrorMessages.needToBeValid",
            ]);
          });
        } else if (err instanceof BadPasswordError) {
          apiResponseStatus.value = undefined;

          validationErrorMessageMap.value.set("oldPassword", [
            "validationErrorMessages.incorrectPassword",
          ]);
        } else {
          apiResponseStatus.value = "error";
        }
      });
  }
};
</script>

<template>
  <InputForm
    :fields="{
      oldPassword: '',
      password: '',
      passwordRepeat: '',
    }"
    submitButtonText="components.passwordChange.buttons.change"
    @submitForm="changePassword"
    :externalValidationError="validationErrorMessageMap"
    :responseStatus="apiResponseStatus"
  />
  <br />
  <br />
  <h3 v-if="apiResponseStatus === 'pending'">{{ $t("messages.loading") }}</h3>
  <h3 id="success" v-if="apiResponseStatus === 'successful'">
    {{ $t("components.passwordChange.messages.successful") }}
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
