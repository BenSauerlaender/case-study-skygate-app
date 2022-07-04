<script setup lang="ts">
import type { FormInputs } from "@/helper/types";
import { useStore } from "@/stores/store";
import { useI18n } from "vue-i18n";
import InputForm from "./BaseInputForm.vue";

const props = defineProps<{
  userID: number;
  privileged: boolean;
}>();
const emit = defineEmits<{
  (e: "userChanged"): void;
}>();

const { t } = useI18n();
const store = useStore();

const changeEmail = (inputs: Partial<FormInputs>) =>
  store.updateUsersEmail(props.userID, inputs.email!).then(() => {
    return t("components.emailChange.messages.successful", {
      email: inputs.email!,
    });
  });

const changeEmailPrivileged = (inputs: Partial<FormInputs>) =>
  store.updateUsersEmailPrivileged(props.userID, inputs.email!).then(() => {
    emit("userChanged");
    return t("components.emailChange.messages.successfulPrivileged");
  });
</script>

<!-- Component to request a users email change-->
<template>
  <InputForm
    :defaultFields="{
      email: '',
    }"
    :requiredFields="['email']"
    submitButtonText="components.emailChange.buttons.change"
    :submitFunction="privileged ? changeEmailPrivileged : changeEmail"
  />
</template>
<style scoped></style>
