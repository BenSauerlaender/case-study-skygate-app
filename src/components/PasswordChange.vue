<script setup lang="ts">
import { InvalidPropsError } from "@/helper/errors";
import type { ApiResponseStatus, FormInputs } from "@/helper/types";
import { useStore, type User, type UserWithID } from "@/stores/store";
import { ref, type Ref } from "vue";
import InputForm from "./InputForm.vue";

const props = defineProps<{
  user: UserWithID;
}>();

const store = useStore();

const apiResponseStatus: Ref<ApiResponseStatus> = ref(undefined);
const validationErrorMessageMap: Ref<Map<keyof User, string[]>> = ref(
  new Map()
);

const changeData = (inputs: Partial<FormInputs> | null) => {
  if (inputs === null) {
    apiResponseStatus.value = undefined;
    validationErrorMessageMap.value = new Map();
  } else {
    if (apiResponseStatus.value === "pending") return;
    validationErrorMessageMap.value = new Map();
    apiResponseStatus.value = "pending";

    store
      .updateUser(props.user.id, inputs)
      .then(() => {
        apiResponseStatus.value = "successful";
      })
      .catch((err) => {
        if (err instanceof InvalidPropsError) {
          apiResponseStatus.value = undefined;

          console.log(err.invalidProps);
          err.invalidProps.forEach((value, key) => {
            validationErrorMessageMap.value.set(key, [
              "validationErrorMessages.needToBeValid",
            ]);
          });
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
      name: user.name,
      postcode: user.postcode,
      city: user.city,
      phone: user.phone,
    }"
    submitButtonText="components.userDataChange.buttons.change"
    @submitForm="changeData"
    :externalValidationError="validationErrorMessageMap"
    :responseStatus="apiResponseStatus"
  />
  <br />
  <br />
  <h3 v-if="apiResponseStatus === 'pending'">{{ $t("messages.loading") }}</h3>
  <h3 id="success" v-if="apiResponseStatus === 'successful'">
    {{ $t("components.userDataChange.messages.successful") }}
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
