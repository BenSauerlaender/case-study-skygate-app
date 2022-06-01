<script setup lang="ts">
import ErrorLog from "@/components/ErrorLog.vue";
import { ref, type Ref } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, isChecked } from "@/helper/validators";

/**
 * Information the user inserts to the register form
 */
const input = ref({
  email: "",
  name: "",
  postcode: "",
  city: "",
  phone: "",
  password: "",
  passwordRepeat: "",
  readLegals: false,
});

/**
 * Validation rules that need to match to register
 */
const validationRules = {
  email: { required },
  name: { required },
  postcode: { required },
  city: { required },
  phone: { required },
  password: { required },
  passwordRepeat: { required },
  readLegals: { required, isChecked },
};

/**
 * A map that holds for each input-field a list of errorMessages.
 *
 * The errorMessages are path to the i18n messages to show the user
 */
const validationErrorMessageMap: Ref<Map<string, string[]>> = ref(new Map());

/**
 * The Vuelidation object to validate the input
 */
const v$ = useVuelidate(validationRules, input);

/**
 * Event to register the new user (invoked by user-button-click)
 */
const register = async (event: Event) => {
  //validate the input
  const result = await v$.value.$validate();
  if (!result) {
    //write all validation errors in validationErrorMessageMap
    validationErrorMessageMap.value = new Map();
    v$.value.$errors.forEach((error) => {
      let errorList =
        validationErrorMessageMap.value.get(error.$property) ?? [];
      errorList.push(
        typeof error.$message === "string"
          ? error.$message
          : error.$message.value
      );
      validationErrorMessageMap.value.set(error.$property, errorList);
    });
    return;
  }
};
</script>

<template>
  <div id="frame">
    <div id="inputs">
      <div v-for="(value, key) of input">
        <!-- Special case for the checkbox -->
        <template v-if="key === 'readLegals'">
          <br />
          <input
            type="checkbox"
            id="{{key}}"
            v-model="input.readLegals"
            :class="{ invalid: validationErrorMessageMap.has(key) }"
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
        </template>
        <!-- Normal behavior on text-input-fields -->
        <template v-else>
          <!-- Label for field -->
          <label for="{{key}}">{{ $t("inputFields." + key + ".label") }}</label>
          <br />
          <!-- For the Password fields -->
          <template v-if="key === 'password' || key === 'passwordRepeat'">
            <input
              type="password"
              id="{{key}}"
              v-model="input[key]"
              :class="{ invalid: validationErrorMessageMap.has(key) }"
            />
          </template>
          <!-- For all other fields -->
          <template v-else>
            <input
              id="{{key}}"
              v-model="input[key]"
              :class="{ invalid: validationErrorMessageMap.has(key) }"
            />
          </template>
          <br
        /></template>
      </div>
    </div>
    <ErrorLog
      v-if="validationErrorMessageMap.size > 0"
      :errorMap="validationErrorMessageMap"
    />
  </div>

  <button @click="register">{{ $t("sites.register.buttons.register") }}</button>
  <br />
</template>

<style scoped>
.invalid {
  outline: solid var(--color-invalid-input);
}

/* To add space between checkbox and text*/
input {
  margin-right: 10px;
}
#frame {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
</style>
