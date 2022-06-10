<script setup lang="ts">
import { useStore } from "@/stores/store";
import { UserNotLoggedInError } from "@/helper/errors";
import { watch } from "vue";
import { useRouter } from "vue-router";

/**
 * Its an Component that just watches the logged in/out state and redirect to /login if the user was logged out.
 *
 */
const store = useStore();
const router = useRouter();

watch(
  () => store.loggedIn,
  (now, before) => {
    if (now === false && before === true) {
      console.log("logged out!");
      store.loggedInUser = null;
      router.push("/");
    }
  }
);
</script>
<template></template>
