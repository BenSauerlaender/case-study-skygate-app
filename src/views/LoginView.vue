<script setup lang="ts">
import { ref } from "vue";

const email = ref("");
const password = ref("");

function login(event: Event) {}
</script>

<template>
  <h1 class="heading">Anmelden</h1>
  <label for="email">Email: </label>
  <br />
  <input id="email" v-model="email" />
  <br />
  <label for="password">Passwort: </label>
  <br />
  <input id="password" v-model="password" />
  <br />
  <br />
  <button @click="login">einloggen!</button>
  <br />
  <br />
  <RouterLink to="/register">Noch keinen Account?</RouterLink>
</template>
