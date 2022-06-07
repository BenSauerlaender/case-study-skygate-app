<script setup lang="ts">
import { useStore } from "@/stores/store";
import { storeToRefs } from "pinia";
import UserShowcase from "../components/UserShowcase.vue";

const store = useStore();
const { user } = storeToRefs(store);
if (user.value === null) {
  store.fetchUser();
}
</script>

<template>
  <h1 class="heading">{{ $t("sites.profile.name") }}</h1>
  <br />
  <UserShowcase v-if="user" :user="user" />
  <br />
  <br />
  <button @click="store.logoutUser">
    {{ $t("sites.login.buttons.logout") }}
  </button>
</template>
<style scoped></style>
