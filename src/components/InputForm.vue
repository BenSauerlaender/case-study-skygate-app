<script setup lang="ts">
import ErrorLog from "@/components/ErrorLog.vue";
import InputFields from "./InputFields.vue";
import type { ApiResponseStatus, FormInputs } from "@/helper/types";
import { computed, ref, type Ref } from "vue";
import { getValidators } from "@/helper/validators";

const props = defineProps<{
  fields: Array<keyof FormInputs>;
  submitButtonText: string;
  externalValidationError: Map<keyof FormInputs, string[]>;
  responseStatus: ApiResponseStatus;
}>();
const emit = defineEmits(["submitForm"]);

/**
 * A map that holds for each input-field a list of errorMessages.
 *
 * The errorMessages are paths to the i18n messages to show the user
 */
const validationErrorMessageMap: Ref<Map<keyof FormInputs, string[]>> = ref(
  new Map()
);

const combinedValidationErrorMessageMap = computed(() => {
  const combined = new Map(validationErrorMessageMap.value.entries());
  props.externalValidationError.forEach((array, key) => {
    const combinedArray = [...array, ...(combined.get(key) ?? [])];
    combined.set(key, combinedArray);
  });
  return combined;
});

const invalidFields: Ref<Array<keyof FormInputs>> = ref([]);
const submitted: Ref<boolean> = ref(false);

//event triggered by submit button click
const onSubmit = (event: Event) => {
  //allow only if
  if (props.responseStatus === "pending") return;
  //trigger InputFields -> sendInputs
  submitted.value = true;
};

//get the inputs form InputFields -> sendInputs
const getInputs = async (inputs: FormInputs) => {
  validationErrorMessageMap.value = new Map();

  //validate each field
  props.fields.forEach((field) => {
    //check each validator
    getValidators(inputs["password"] ?? "")
      .get(field)!
      .forEach((validator) => {
        const valid = validator(inputs[field]);
        //if validation fails
        if (valid !== true) {
          //add message to validationErrorMessageMap
          const messages = validationErrorMessageMap.value.get(field) ?? [];
          validationErrorMessageMap.value.set(field, [...messages, valid]);
        }
      });
  });

  //if evrything is valid send to parent
  if (validationErrorMessageMap.value.size === 0) {
    invalidFields.value = [];
    emit("submitForm", inputs);
  } else {
    invalidFields.value = [...validationErrorMessageMap.value.keys()];
  }

  //allow another submit
  submitted.value = false;
};
</script>

<template>
  <div id="frame">
    <div id="inputs">
      <InputFields
        :fields="props.fields"
        :invalidFields="invalidFields"
        :submitted="submitted"
        @sendInputs="getInputs"
      />
    </div>
    <ErrorLog
      v-if="invalidFields.length > 0"
      :errorMap="combinedValidationErrorMessageMap"
    />
  </div>
  <button @click="onSubmit">{{ $t(props.submitButtonText) }}</button>
</template>

<style scoped>
#frame {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
</style>
