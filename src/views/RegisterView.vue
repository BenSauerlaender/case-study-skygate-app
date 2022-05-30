<script setup lang="ts">
import { ref } from "vue";

const email = ref("");
const name = ref("");
const postcode = ref("");
const city = ref("");
const phone = ref("");
const password = ref("");
const passwordRepeat = ref("");
const readLegals = ref(false);

function register(event: Event) {}
</script>

<template>
  <h1 class="heading">Account erstellen</h1>

  <label for="email">Email: </label>
  <br />
  <input id="email" v-model="email" />
  <br />

  <label for="name">Name: </label>
  <br />
  <input id="name" v-model="name" />
  <br />

  <label for="postcode">PLZ: </label>
  <br />
  <input id="postcode" v-model="postcode" />
  <br />

  <label for="city">Ort: </label>
  <br />
  <input id="city" v-model="city" />
  <br />

  <label for="phone">Telefonnummer: </label>
  <br />
  <input id="phone" v-model="phone" />
  <br />

  <label for="password">Passwort: </label>
  <br />
  <input id="password" v-model="password" />
  <br />

  <label for="password-repeat">Passwort wiederholen: </label>
  <br />
  <input id="password-repeat" v-model="passwordRepeat" />
  <br />
  <br />

  <input type="checkbox" id="readLegals" v-model="readLegals" />
  <label for="readLegals">
    Ich stimme den
    <RouterLink to="/terms-of-use">Nutzungsbedingungen</RouterLink> zu und habe
    die
    <RouterLink to="/privacy">Datenschutzerklärung</RouterLink> gelesen.</label
  >
  <br />

  <button @click="register">registrieren!</button>
  <br />
  <br />

  <RouterLink to="/login">Bereits registriert?</RouterLink>
</template>
