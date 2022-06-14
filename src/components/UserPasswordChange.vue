<script setup lang="ts">
import type { FormInputs } from "@/helper/types";
import { useStore } from "@/stores/store";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import InputForm from "./BaseInputForm.vue";

const props = defineProps<{
  userID: number;
}>();

const router = useRouter();
const store = useStore();
const { t } = useI18n();

const changePassword = (inputs: Partial<FormInputs>) =>
  store
    .updateUsersPassword(props.userID, inputs.oldPassword!, inputs.password!)
    .then(() => {
      return t("components.passwordChange.messages.successful");
    });

const hasChanged = () => {
  //if its the logged in user -> logout
  if (props.userID === store.loggedInUser!.id) {
    setTimeout(() => {
      store.logoutUser();
    }, 1000);
  }
};
</script>

<!-- Component to change a users password-->
<template>
  <InputForm
    :defaultFields="{
      oldPassword: '',
      password: '',
      passwordRepeat: '',
    }"
    :requiredFields="['oldPassword', 'password', 'passwordRepeat']"
    submitButtonText="components.passwordChange.buttons.change"
    :submitFunction="changePassword"
    @submitSuccessful="hasChanged"
  />
</template>
<style scoped></style>
