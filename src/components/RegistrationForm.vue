<script setup lang="ts">
import { ref, type Ref } from "vue";
import useVuelidate from "@vuelidate/core";
import { required } from "@/helper/validation";

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
  readLegals: { required },
};

const validationErrors: Ref<Map<string, string[]>> = ref(new Map());

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
    v$.value.$errors.forEach((error) => {
      validationErrors.value.set(error.$property);
    });
    return;
  }
};
</script>

<template>
  <div v-for="(value, key) of input">
    <!-- Special case for the checkbox -->
    <template v-if="key === 'readLegals'">
      <br />
      <input type="checkbox" id="{{key}}" v-model="input.readLegals" />
      <label for="{{key}}">
        <i18n-t keypath="inputFields.readLegals.label" tag="i">
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
        <input type="password" id="{{key}}" v-model="input[key]" />
      </template>
      <!-- For all other fields -->
      <template v-else>
        <input id="{{key}}" v-model="input[key]" />
      </template>
      <br
    /></template>
  </div>

  <br />

  <button @click="register">{{ $t("sites.register.buttons.register") }}</button>
</template>
