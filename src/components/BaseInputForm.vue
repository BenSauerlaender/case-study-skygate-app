<script setup lang="ts">
import BaseInputFormErrorLog from "@/components/BaseInputFormErrorLog.vue";
import BaseInputFormFields from "./BaseInputFormFields.vue";
import type { FormInputs } from "@/helper/types";
import { computed, ref, type Ref } from "vue";
import { getAllValidators, checkRequired } from "@/helper/validators";
import { BadPasswordError, InvalidPropsError } from "@/helper/errors";

const props = defineProps<{
  defaultFields: FormInputs; //an Object containing all fields that should be displayed as keys and there default values as value
  requiredFields: Array<keyof FormInputs>; //A list of fields that are required
  submitButtonText: string; //the text on the submit button

  // A function that will be executed if the submit button is pressed,
  submitFunction: (
    formInputs: Partial<FormInputs> //The values the user wrote in the input fields
  ) => Promise<string>; //A promise that resolve by success to a successMessage
}>();

const emit = defineEmits<{
  (e: "submitSuccessful"): void; //emit to say the parent the submit was successful
}>();

/**
 * A map that holds for each field a list of errorMessages.
 *
 * The errorMessages are paths to the i18n messages to show the user
 */
const validationErrorMessageMap: Ref<Map<keyof FormInputs, string[]>> = ref(
  new Map()
);

//the current status of the form
const status: Ref<"pending" | "waiting" | "error" | "successful"> =
  ref("waiting");

//The message that displays on success
const successMessage = ref("");

//set to true to trigger the <BaseInputFields /> to send the input-field-values
const sendInputs: Ref<boolean> = ref(false);

//event triggered by submit button click: requests the input-field-values
const onSubmit = (event: Event) => {
  //allow only if there is currently no processing submit
  if (status.value !== "pending") {
    //trigger InputFields -> sendInputs
    sendInputs.value = true;
  }
};

//triggered by onSubmit -> pleaseSendInputs -> sendInputs
const onGetInputs = (inputs: FormInputs) => {
  //set trigger to default state
  sendInputs.value = false;

  // copy the inputs
  const inputsCopy = { ...inputs };

  //remove all inputs that not changed from default
  (Object.keys(inputsCopy) as Array<keyof FormInputs>).forEach((field) => {
    if (inputsCopy[field] === props.defaultFields[field]) {
      delete inputsCopy[field];
    }
  });

  //reset the errorMessages
  validationErrorMessageMap.value = new Map();

  //if no value is set do nothing
  if (Object.keys(inputsCopy).length === 0) return;

  const missingFields: Array<keyof FormInputs> = [];

  //check if required fields are present
  props.requiredFields.forEach((field) => {
    const required = checkRequired(inputsCopy[field]);
    if (required !== true) {
      validationErrorMessageMap.value.set(field, [required]);
      missingFields.push(field);
    }
  });

  //get all validators
  const validators = getAllValidators(inputsCopy["password"] ?? ""); //password need to be passed into validator construction to match against passwordRepeat

  //check all validators
  validators.forEach((validators, field) => {
    //if a required field is missing: skip
    if (missingFields.includes(field)) return;
    if (!Object.keys(inputsCopy).includes(field)) return;
    validators.forEach((validator) => {
      const valid = validator(inputsCopy[field]);
      //if validation fails
      if (valid !== true) {
        //add message to validationErrorMessageMap
        const messages = validationErrorMessageMap.value.get(field) ?? [];
        validationErrorMessageMap.value.set(field, [...messages, valid]);
      }
    });
  });

  //if every field is valid perform submitFunction
  if (validationErrorMessageMap.value.size === 0) {
    //set status to pending so no other submit will be accepted
    status.value = "pending";

    //perform the function defined by the parent
    props
      .submitFunction(inputsCopy)

      //if the submitFunction was successful print the success message and clear the inputFields
      .then((message) => {
        successMessage.value = message;
        status.value = "successful";
        clearInputFields();
        emit("submitSuccessful");
      })
      .catch((err) => {
        //if the props are invalid
        if (err instanceof InvalidPropsError) {
          //add the invalid fields to the validationErrorMessageMap
          err.invalidProps.forEach((value, key) => {
            // if its email is taken: the message is more verbose
            if (key === "email" && value["msg"] == "Email is taken") {
              validationErrorMessageMap.value.set("email", [
                "validationErrorMessages.isTaken",
              ]);
            } else {
              // else just display, that the field is not valid
              validationErrorMessageMap.value.set(key, [
                "validationErrorMessages.needToBeValid",
              ]);
            }
          });

          //wait for the next submit
          status.value = "waiting";
        } else if (err instanceof BadPasswordError) {
          // if the password is wrong: the message is more verbose
          validationErrorMessageMap.value.set("oldPassword", [
            "validationErrorMessages.incorrectPassword",
          ]);
        } else {
          //if the error cant be specified display an
          status.value = "error";
          clearInputFields();
        }
      });
  }
};

//set to true to trigger the <BaseInputFields /> to clear the inputFields
const pleaseClear: Ref<boolean> = ref(false);
const clearInputFields = () => {
  pleaseClear.value = true;
};
const wasCleared = () => (pleaseClear.value = false);

//A list of all fields that are invalid
const invalidFields = computed(() => [
  ...validationErrorMessageMap.value.keys(),
]);

//A the validationErrorMessageMap but sorted the same way as defaultFields
const sortedValidationErrorMessageMap = computed(() => {
  const map = new Map();
  (Object.keys(props.defaultFields) as Array<keyof FormInputs>).forEach(
    (field) => {
      if (validationErrorMessageMap.value.has(field))
        map.set(field, validationErrorMessageMap.value.get(field));
    }
  );
  return map;
});
</script>

<!-- component that provide a basic input form  -->
<template>
  <!-- split component vertical  -->
  <div id="frame">
    <!-- left side: the input fields  -->
    <div id="inputs">
      <BaseInputFormFields
        :defaultFields="props.defaultFields"
        :invalidFields="invalidFields"
        :pleaseSendInput="sendInputs"
        :pleaseClear="pleaseClear"
        @sendInputs="onGetInputs"
        @cleared="wasCleared"
      />
    </div>

    <!-- right side: the Errorlog to display the reasons why fields are invalid  -->
    <BaseInputFormErrorLog
      v-if="invalidFields.length > 0"
      :errorMap="sortedValidationErrorMessageMap"
    />
  </div>
  <br />

  <!-- the submit button  -->
  <button @click="onSubmit">{{ $t(props.submitButtonText) }}</button>
  <br />
  <br />

  <!-- pending, error, success message  -->
  <h3 v-if="status === 'pending'">{{ $t("messages.loading") }}</h3>
  <h3 class="success" v-if="status === 'successful'">{{ successMessage }}</h3>
  <h3 class="error" v-if="status === 'error'">{{ $t("messages.ApiError") }}</h3>
</template>

<style scoped>
#frame {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
</style>
