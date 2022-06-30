<script setup lang="ts">
import type { FormInputs } from "@/helper/types";
import { useStore } from "@/stores/store";
import { useI18n } from "vue-i18n";
import InputForm from "./BaseInputForm.vue";

const props = defineProps<{
  userID: number;
  privileged: boolean;
}>();

const { t } = useI18n();
const store = useStore();

const changeEmail = (inputs: Partial<FormInputs>) =>
  store.updateUsersEmail(props.userID, inputs.email!).then(() => {
    return t("components.emailChange.messages.successful", {
      email: inputs.email!,
    });
  });
</script>

<!-- Component to request a users email change-->
<template></template>
<style scoped></style>
