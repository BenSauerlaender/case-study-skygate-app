<script setup lang="ts">
import type { FormInputs, PublicUser } from "@/helper/types";
import { useStore } from "@/stores/store";
import { toRefs } from "vue";
import { useI18n } from "vue-i18n";
import InputForm from "./BaseInputForm.vue";

const props = defineProps<{
  user: PublicUser;
}>();
const emit = defineEmits<{
  (e: "userChanged"): void;
}>();

const { user } = toRefs(props);

const store = useStore();
const { t } = useI18n();

const changeData = (inputs: Partial<FormInputs>) =>
  store.updateUserContactData(user.value.id, inputs).then(() => {
    return t("components.contactDataChange.messages.successful");
  });
</script>

<!-- Component to change a users contact data-->
<template>
  <InputForm
    :defaultFields="{
      name: user.name,
      postcode: user.postcode,
      city: user.city,
      phone: user.phone,
    }"
    :requiredFields="[]"
    submitButtonText="components.contactDataChange.buttons.change"
    :submitFunction="changeData"
    @submitSuccessful="
      () => {
        emit('userChanged');
      }
    "
  />
</template>
<style scoped></style>
