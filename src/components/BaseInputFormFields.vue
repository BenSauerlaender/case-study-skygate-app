<script setup lang="ts">
import { ref, toRefs, watch, type Ref } from "vue";
import type { FormInputs } from "@/helper/types";

const props = defineProps<{
  defaultFields: FormInputs; //an Object containing all fields that should be displayed as keys and there default values as value
  invalidFields: Array<keyof FormInputs>; //A list of fields that are invalid -> so should be rendered with red border
  pleaseSendInput: boolean; //An 'event' that comes from the parent to request the input values
  pleaseClear: boolean; //An 'event' that comes from the parent to request clearing the input-fields
}>();

const emit = defineEmits<{
  (e: "sendInputs", inputs: FormInputs): void; //emit to send the inputs to the parent
  (e: "cleared"): void; //emit to say the parent the fields were cleared
}>();

//get props as refs
const { defaultFields, invalidFields } = toRefs(props);

// Information the user inserts in the input-fields set to default values
const formInputs: Ref<FormInputs> = ref({ ...props.defaultFields });

//set the inputFields back to there default values
const clearInputFields = () =>
  Object.assign(formInputs.value, defaultFields.value);

//if the default values changed -> clear the fields
watch(() => defaultFields.value, clearInputFields);

//clear the inputFields if the parent ask for it
watch(
  () => props.pleaseClear,
  (status) => {
    if (status) {
      clearInputFields;
      emit("cleared");
    }
  }
);

//end the inputs if the parent ask for it
watch(
  () => props.pleaseSendInput,
  (status) => {
    if (status) {
      emit("sendInputs", formInputs.value);
    }
  }
);

// true if the specified filed is invalid
const isInvalid = (field: keyof FormInputs) =>
  invalidFields.value.includes(field);
</script>

<!-- component that provide a list of input fields. The type of the input fields can be specified by props.defaultFields -->
<template>
  <template v-for="(x, field) in defaultFields">
    <!-- standard text input -->
    <div v-if="['email', 'name', 'postcode', 'city', 'phone'].includes(field)">
      <label :for="field">{{ $t("inputFields." + field + ".label") }}</label>
      <br />
      <input
        :id="field"
        v-model="formInputs[field]"
        :class="{ invalid: isInvalid(field) }"
      />
    </div>
    <!-- password text input -->
    <div v-if="['oldPassword', 'password', 'passwordRepeat'].includes(field)">
      <label :for="field">{{ $t("inputFields." + field + ".label") }}</label>
      <br />
      <input
        type="password"
        :id="field"
        v-model="formInputs[field]"
        :class="{ invalid: isInvalid(field) }"
      />
    </div>
    <!-- checkbox -->
    <div v-if="['readLegals'].includes(field)">
      <br />
      <input
        type="checkbox"
        :id="field"
        v-model="formInputs['readLegals']"
        :class="{ invalid: isInvalid(field) }"
      />
      <!-- label that links to termsOfUse and privacy pages -->
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
