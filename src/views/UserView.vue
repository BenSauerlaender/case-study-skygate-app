<script setup lang="ts">
import { useStore } from "@/stores/store";
import { NoUserError } from "@/helper/errors";
import { computed, ref, watchEffect, type Ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import User from "../components/User.vue";
import type { PublicUser } from "@/helper/types";

const store = useStore();

const route = useRoute();
const router = useRouter();
const user: Ref<null | PublicUser> = ref(null);

//get the user id as number from the url
const requestedUserID = computed(() =>
  parseInt(
    typeof route.params.id === "string" ? route.params.id : route.params.id[0]
  )
);

//fetch the requested user from the api
const fetchUser = async () => {
  store
    .getUser(requestedUserID.value)
    .then((u) => {
      user.value = u;
    })
    //redirect to 404 if no user found
    .catch((err) => {
      if (err instanceof NoUserError) {
        router.replace("/404");
      }
    });
};

//watch the requestedUserId and redirect to profile if its the logged in user
watchEffect(async () => {
  if (!route.path.startsWith("/user")) return;
  if (store.accessTokenPayload!.id === requestedUserID.value) {
    router.replace("/profile");
    return;
  } else {
    fetchUser();
  }
});
</script>

<!-- page, to show a specific user's data + possibility for admins to change the data-->
<template>
  <h1 class="heading">{{ $t("sites.user.name") }}</h1>
  <br />
  <User v-if="user" :user="user" @user-changed="fetchUser" />
</template>
<style scoped></style>
