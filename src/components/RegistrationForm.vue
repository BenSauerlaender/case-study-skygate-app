<script setup lang="ts">
import { reactive } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, email, alpha, integer, sameAs } from "@vuelidate/validators";

/**
 * Information the user inserts to register
 */
const info = reactive({
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
const rules = {
  email: { required, email },
  name: { required, alpha },
  postcode: { required, integer },
  city: { required, alpha },
  phone: { required },
  password: { required },
  passwordRepeat: { required, isSame: sameAs(info.password) },
  readLegals: { required, isChecked: sameAs(true) },
};

/**
 * The Vuelidation object
 */
const v$ = useVuelidate(rules, info);

const register = async (event: Event) => {
  const result = await v$.value.$validate();
  if (!result) {
    v$.value.$errors.forEach((element) => {});
    return;
  }
};
</script>

<template>
  <label for="email">Email: </label>
  <br />
  <input id="email" v-model="info.email" />
  <br />

  <label for="name">Name: </label>
  <br />
  <input id="name" v-model="info.name" />
  <br />

  <label for="postcode">PLZ: </label>
  <br />
  <input id="postcode" v-model="info.postcode" />
  <br />

  <label for="city">Ort: </label>
  <br />
  <input id="city" v-model="info.city" />
  <br />

  <label for="phone">Telefonnummer: </label>
  <br />
  <input id="phone" v-model="info.phone" />
  <br />

  <label for="password">Passwort: </label>
  <br />
  <input type="password" id="password" v-model="info.password" />
  <br />

  <label for="password-repeat">Passwort wiederholen: </label>
  <br />
  <input type="password" id="password-repeat" v-model="info.passwordRepeat" />
  <br />
  <br />

  <input type="checkbox" id="readLegals" v-model="info.readLegals" />
  <label for="readLegals">
    Ich stimme den
    <RouterLink to="/terms-of-use">Nutzungsbedingungen</RouterLink> zu und habe
    die
    <RouterLink to="/privacy">Datenschutzerklärung</RouterLink> gelesen.</label
  >
  <br />

  <button @click="register">registrieren!</button>
</template>
