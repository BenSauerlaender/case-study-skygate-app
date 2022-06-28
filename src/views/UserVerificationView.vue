<script setup lang="ts">
import { useStore } from "@/stores/store";
import { ref, watchEffect, type Ref } from "vue";
import { useRoute, type LocationQuery } from "vue-router";
import { AlreadyVerifiedError, NoUserError } from "@/helper/errors";

const route = useRoute();
const store = useStore();

const status: Ref<
  "pending" | "successful" | "failure" | "alreadyVerified" | "noUser"
> = ref("pending");

const verifyUser = (query: LocationQuery) => {
  status.value = "pending";
  store
    .verifyUser(query["userID"], query["code"])
    .then(() => {
      status.value = "successful";
    })
    .catch((e) => {
      if (e instanceof AlreadyVerifiedError) {
        status.value = "alreadyVerified";
      } else if (e instanceof NoUserError) {
        status.value = "noUser";
      } else {
        status.value = "failure";
      }
    });
};

//parses the query every time the url changes
watchEffect(() => {
  if (route.path === "/verify-user") {
    verifyUser({ ...route.query });
  }
});
</script>

<template>
  <h1 class="heading">{{ $t("sites.verifyUser.name") }}</h1>
  <br />

  <template v-if="status === 'pending'">
    <p>{{ $t("messages.loading") }}</p>
  </template>

  <template v-if="status === 'noUser'">
    <p class="error">{{ $t("sites.verifyUser.message.NoUser") }}</p>
  </template>

  <template v-if="status === 'failure'">
    <p class="error">{{ $t("messages.ApiError") }}</p>
  </template>

  <template v-if="status === 'alreadyVerified' || status === 'successful'">
    <p v-if="status === 'successful'" class="success">
      {{ $t("sites.verifyUser.message." + status) }}
    </p>
    <p v-if="status === 'alreadyVerified'" class="error">
      {{ $t("sites.verifyUser.message." + status) }}
    </p>
    <br />

    <RouterLink to="/login">
      {{ $t("sites.verifyUser.links.login") }}
    </RouterLink>
  </template>
</template>
