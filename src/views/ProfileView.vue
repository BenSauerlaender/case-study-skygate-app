<script setup lang="ts">
import { useStore } from "@/stores/store";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import User from "../components/User.vue";

const router = useRouter(); //used in template
const store = useStore();
const user = storeToRefs(store).loggedInUser;

//if the loggedInUser data not fetch yet -> fetch it
if (user.value === null) {
  store.fetchUser();
}
</script>

<!-- page, to show the logged in user they data + possibility to change the data + logout button -->
<template>
  <h1 class="heading">{{ $t("sites.profile.name") }}</h1>
  <br />
  <User v-if="user" :user="user" @user-changed="store.fetchUser" />
  <br />
  <br />
  <button @click="store.logoutUser">
    {{ $t("sites.login.buttons.logout") }}
  </button>
</template>
<style scoped></style>
