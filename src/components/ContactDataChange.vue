<script setup lang="ts">
import { InvalidPropsError } from "@/helper/errors";
import type { ApiResponseStatus, FormInputs } from "@/helper/types";
import { useStore, type User, type UserWithID } from "@/stores/store";
import { ref, toRefs, type Ref } from "vue";
import InputForm from "./InputForm.vue";

const props = defineProps<{
  user: UserWithID;
}>();
const emit = defineEmits<{
  (e: "userChanged"): void;
}>();

const { user } = toRefs(props);

const store = useStore();

const apiResponseStatus: Ref<ApiResponseStatus> = ref(undefined);
const validationErrorMessageMap: Ref<Map<keyof User, string[]>> = ref(
  new Map()
);

const changeData = (inputs: Partial<FormInputs> | null) => {
  //remove props that have not been changed
  const clearedInputs = { ...inputs };
  Object.keys(inputs ?? {}).forEach((prop) => {
    if (
      (inputs ?? {})[prop as keyof FormInputs] ===
      user.value[prop as keyof User]
    ) {
      delete clearedInputs[prop as keyof FormInputs];
    }
  });
  //check if any props should be updated
  if (clearedInputs === null || Object.keys(clearedInputs).length === 0) {
    apiResponseStatus.value = undefined;
    validationErrorMessageMap.value = new Map();
  } else {
    if (apiResponseStatus.value === "pending") return;
    validationErrorMessageMap.value = new Map();
    apiResponseStatus.value = "pending";

    store
      .updateUser(user.value.id, clearedInputs)
      .then(() => {
        apiResponseStatus.value = "successful";
        emit("userChanged");
      })
      .catch((err) => {
        if (err instanceof InvalidPropsError) {
          apiResponseStatus.value = undefined;

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
    submitButtonText="components.contactDataChange.buttons.change"
    @submitForm="changeData"
    :externalValidationError="validationErrorMessageMap"
    :responseStatus="apiResponseStatus"
  />
  <br />
  <br />
  <h3 v-if="apiResponseStatus === 'pending'">{{ $t("messages.loading") }}</h3>
  <h3 id="success" v-if="apiResponseStatus === 'successful'">
    {{ $t("components.contactDataChange.messages.successful") }}
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
