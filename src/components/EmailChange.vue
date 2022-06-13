<script setup lang="ts">
import { InvalidPropsError } from "@/helper/errors";
import type { ApiResponseStatus, FormInputs } from "@/helper/types";
import { useStore, type User, type UserWithID } from "@/stores/store";
import { ref, type Ref } from "vue";
import InputForm from "./InputForm.vue";

const props = defineProps<{
  userID: number;
  oldEmail: string;
}>();

const newEmail = ref("");

const store = useStore();

const apiResponseStatus: Ref<ApiResponseStatus> = ref(undefined);
const validationErrorMessageMap: Ref<Map<keyof User, string[]>> = ref(
  new Map()
);

const changeEmail = (inputs: Partial<FormInputs> | null) => {
  const email = inputs!.email!;
  if (!email || email === props.oldEmail) {
    apiResponseStatus.value = undefined;
    validationErrorMessageMap.value = new Map();
  } else {
    if (apiResponseStatus.value === "pending") return;
    validationErrorMessageMap.value = new Map();
    apiResponseStatus.value = "pending";

    store
      .updateUsersEmail(props.userID, email)
      .then(() => {
        apiResponseStatus.value = "successful";
        newEmail.value = email;
      })
      .catch((err) => {
        if (err instanceof InvalidPropsError) {
          apiResponseStatus.value = undefined;

          err.invalidProps.forEach((value, key) => {
            if (key === "email" && value[0] === "IS_TAKEN") {
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
  }
};
</script>

<template>
  <InputForm
    :fields="{
      email: '',
    }"
    submitButtonText="components.emailChange.buttons.change"
    @submitForm="changeEmail"
    :externalValidationError="validationErrorMessageMap"
    :responseStatus="apiResponseStatus"
  />
  <br />
  <br />
  <h3 v-if="apiResponseStatus === 'pending'">{{ $t("messages.loading") }}</h3>
  <h3 id="success" v-if="apiResponseStatus === 'successful'">
    {{ $t("components.emailChange.messages.successful", { email: newEmail }) }}
  </h3>
  <h3 id="error" v-if="apiResponseStatus === 'error'">
    {{ $t("messages.ApiError") }}
  </h3>
</template>
<style scoped></style>
