<script setup lang="ts">
import { useStore } from "@/stores/store";
import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";

/**
 * Its an Component that just watches the logged in/out state and redirect to /login if the user was logged out.
 */

const store = useStore();
const router = useRouter();
const route = useRoute();

watch(
  () => store.loggedIn,
  (now, before) => {
    if (now === false && before === true && route.path !== "/change-email") {
      store.loggedInUser = null;
      router.push("/");
    }
  }
);
</script>
<template></template>
