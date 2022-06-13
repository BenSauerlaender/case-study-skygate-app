<script setup lang="ts">
import LoginForm from "@/components/LoginForm.vue";
import { useStore } from "@/stores/store";
import { storeToRefs } from "pinia";
import { RouterLink } from "vue-router";

const store = useStore();
const { loggedIn } = storeToRefs(store);
</script>

<!-- page with log in form, to let the user log in + link to register-page -->
<template>
  <h1 class="heading">{{ $t("sites.login.name") }}</h1>
  <br />
  <div v-if="loggedIn === false">
    <!-- The main component  -->
    <LoginForm />
    <br />
    <!-- Link to register  -->
    <RouterLink to="/register">{{
      $t("sites.login.links.noAccount")
    }}</RouterLink>
  </div>
  <!--If user is already logged in -> tell they and offer to log out -->
  <div v-else-if="loggedIn === true">
    <h3>{{ $t("sites.login.messages.alreadyLoggedIn") }}</h3>
    <button @click="store.logoutUser">
      {{ $t("sites.login.buttons.logout") }}
    </button>
  </div>
</template>

<style scoped></style>
