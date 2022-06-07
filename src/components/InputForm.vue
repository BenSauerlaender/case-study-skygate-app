<script setup lang="ts">
import ErrorLog from "@/components/ErrorLog.vue";
import InputFields from "./InputFields.vue";
import type { ApiResponseStatus, FormInputs } from "@/helper/types";
import { computed, ref, watch, type Ref } from "vue";
import { getValidators, required } from "@/helper/validators";

const props = defineProps<{
  fields: FormInputs;
  submitButtonText: string;
  externalValidationError: Map<keyof FormInputs, string[]>;
  responseStatus: ApiResponseStatus;
}>();
const emit = defineEmits<{
  (e: "submitForm", inputs: FormInputs | null): void;
}>();

/**
 * A map that holds for each input-field a list of errorMessages.
 *
 * The errorMessages are paths to the i18n messages to show the user
 */
const validationErrorMessageMap: Ref<Map<keyof FormInputs, string[]>> = ref(
  new Map()
);

const combinedInvalidFields = computed(() => [
  ...invalidFields.value,
  ...props.externalValidationError.keys(),
]);

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
const clearing: Ref<boolean> = ref(false);

watch(
  () => props.responseStatus,
  (status) => {
    if (status === "successful" || status === "error") {
      clearing.value = true;
    }
  }
);
const wasCleared = () => (clearing.value = false);

//event triggered by submit button click
const onSubmit = (event: Event) => {
  //allow only if
  if (props.responseStatus === "pending") return;
  //trigger InputFields -> sendInputs
  submitted.value = true;
};

//get the inputs form InputFields -> sendInputs
const getInputs = (inputs: FormInputs) => {
  validationErrorMessageMap.value = new Map();

  //validate each field
  (Object.keys(props.fields) as Array<keyof FormInputs>).forEach((field) => {
    //check if required fields are present
    const isPresent = required(inputs[field]);
    if (isPresent === true) {
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
    } else {
      validationErrorMessageMap.value.set(field, [isPresent]);
    }
  });

  //if evrything is valid send to parent
  if (validationErrorMessageMap.value.size === 0) {
    invalidFields.value = [];
    emit("submitForm", inputs);
  } else {
    emit("submitForm", null);
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
        :invalidFields="combinedInvalidFields"
        :submitted="submitted"
        :clearing="clearing"
        @sendInputs="getInputs"
        @sendCleared="wasCleared"
      />
    </div>
    <ErrorLog
      v-if="combinedInvalidFields.length > 0"
      :errorMap="combinedValidationErrorMessageMap"
    />
  </div>
  <br />
  <button @click="onSubmit">{{ $t(props.submitButtonText) }}</button>
</template>

<style scoped>
#frame {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
</style>
