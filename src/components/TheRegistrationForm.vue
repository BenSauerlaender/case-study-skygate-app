<script setup lang="ts">
import { useStore } from "@/stores/store";
import InputForm from "./BaseInputForm.vue";
import type { FormInputs } from "@/helper/types";
import type { PrivateUser } from "@/helper/types";
import { useI18n } from "vue-i18n";

const store = useStore();
const { t } = useI18n();

const register = (inputs: Partial<FormInputs>) =>
  store.registerUser(inputs as PrivateUser).then(() => {
    return t("sites.register.messages.successful", { email: inputs["email"] });
  });
</script>

<!-- Input form component for registration-->
<template>
  <InputForm
    :defaultFields="{
      email: '',
      name: '',
      postcode: '',
      city: '',
      phone: '',
      password: '',
      passwordRepeat: '',
      readLegals: false,
    }"
    :requiredFields="[
      'email',
      'name',
      'postcode',
      'city',
      'phone',
      'password',
      'passwordRepeat',
      'readLegals',
    ]"
    :submitFunction="register"
    submitButtonText="sites.register.buttons.register"
  />
</template>

<style scoped></style>
