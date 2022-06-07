<script setup lang="ts">
import { useStore } from "@/stores/store";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import UserShowcase from "../components/UserShowcase.vue";

const store = useStore();
const { user } = storeToRefs(store);
if (user.value === null) {
  store.fetchUser();
}
const router = useRouter();
const logout = () => store.logoutUser().then(() => router.push("/login"));
</script>

<template>
  <h1 class="heading">{{ $t("sites.profile.name") }}</h1>
  <br />
  <UserShowcase v-if="user" :user="user" :editable="true" />
  <br />
  <br />
  <button @click="logout">
    {{ $t("sites.login.buttons.logout") }}
  </button>
</template>
<style scoped></style>
