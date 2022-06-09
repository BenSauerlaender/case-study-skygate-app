<script setup lang="ts">
import { ref, toRefs, watch, type Ref } from "vue";
import type { FormInputs } from "@/helper/types";

const props = defineProps<{
  fields: FormInputs;
  invalidFields: Array<keyof FormInputs>;
  submitted: boolean;
  clearing: Boolean;
}>();
const emit = defineEmits<{
  (e: "sendInputs", inputs: FormInputs): void;
  (e: "sendCleared"): void;
}>();

const { fields, invalidFields } = toRefs(props);

/**
 * Information the user inserts to the register form
 */
const formInputs: Ref<FormInputs> = ref({ ...props.fields });

watch(
  () => fields.value,
  () => {
    Object.assign(formInputs.value, fields.value);
  }
);

watch(
  () => props.clearing,
  (status) => {
    if (status) {
      Object.assign(formInputs.value, fields.value);
      emit("sendCleared");
    }
  }
);

watch(
  () => props.submitted,
  (status) => {
    if (status) {
      emit("sendInputs", formInputs.value);
    }
  }
);
</script>

<template>
  <template v-for="(x, field) in fields">
    <div v-if="['email', 'name', 'postcode', 'city', 'phone'].includes(field)">
      <label :for="field">{{ $t("inputFields." + field + ".label") }}</label>
      <br />
      <input
        :id="field"
        v-model="formInputs[field]"
        :class="{ invalid: invalidFields.includes(field) }"
      />
    </div>
    <div v-if="['oldPassword', 'password', 'passwordRepeat'].includes(field)">
      <label :for="field">{{ $t("inputFields." + field + ".label") }}</label>
      <br />
      <input
        type="password"
        :id="field"
        v-model="formInputs[field]"
        :class="{ invalid: invalidFields.includes(field) }"
      />
    </div>
    <div v-if="['readLegals'].includes(field)">
      <br />
      <input
        type="checkbox"
        :id="field"
        v-model="formInputs['readLegals']"
        :class="{ invalid: invalidFields.includes(field) }"
      />
      <label for="{{key}}">
        <i18n-t keypath="inputFields.readLegals.description" tag="i">
          <template v-slot:termsOfUse>
            <RouterLink to="/terms-of-use">{{
              $t("sites.termsOfUse.name")
            }}</RouterLink>
          </template>
          <template v-slot:privacy>
            <RouterLink to="/privacy">{{
              $t("sites.privacy.long")
            }}</RouterLink>
          </template>
        </i18n-t>
      </label>
    </div>
  </template>
</template>

<style scoped>
.invalid {
  outline: solid var(--color-invalid-input);
}
/* To add space between checkbox and text*/
input {
  margin-right: 10px;
}
</style>
