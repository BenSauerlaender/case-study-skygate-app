<script setup lang="ts">
import Form from "@/components/LoginForm.vue";
import { useStore } from "@/stores/store";
import { storeToRefs } from "pinia";

const store = useStore();

const { loggedIn } = storeToRefs(store);

function logout(event: Event) {
  store.logoutUser();
}
</script>

<template>
  <h1 class="heading">{{ $t("sites.login.name") }}</h1>
  <br />
  <div v-if="loggedIn === false">
    <Form />
    <br />
    <RouterLink to="/register">{{
      $t("sites.login.links.noAccount")
    }}</RouterLink>
  </div>
  <div v-else>
    <h3>{{ $t("sites.login.messages.alreadyLoggedIn") }}</h3>
    <button @click="logout">{{ $t("sites.login.buttons.logout") }}</button>
  </div>
</template>
<style scoped>
#error {
  color: var(--color-error);
}
</style>
