<script setup lang="ts">
import { useStore } from "@/stores/store";
import { ref, watchEffect, type Ref } from "vue";
import { useRoute, type LocationQuery } from "vue-router";
import { AlreadyVerifiedError } from "@/helper/errors";

const route = useRoute();
const store = useStore();

const status: Ref<"pending" | "successful" | "failure" | "alreadyChanged"> =
  ref("pending");

const verifyEmailChange = (query: LocationQuery) => {
  status.value = "pending";
  store
    .verifyEmailChange(query["userID"], query["code"])
    .then(() => {
      status.value = "successful";
    })
    .catch((e) => {
      if (e instanceof AlreadyVerifiedError) {
        status.value = "alreadyChanged";
      } else {
        status.value = "failure";
      }
    });
};

//parses the query every time the url changes
watchEffect(() => {
  if (route.path === "/change-email") {
    verifyEmailChange({ ...route.query });
  }
});
</script>

<template>
  <h1 class="heading">{{ $t("sites.emailChange.name") }}</h1>
  <br />

  <template v-if="status === 'failure'">
    <p class="error">{{ $t("messages.ApiError") }}</p>
  </template>

  <template v-if="status === 'pending'">
    <p>{{ $t("messages.loading") }}</p>
  </template>

  <template v-if="status === 'alreadyChanged' || status === 'successful'">
    <p v-if="status === 'successful'" class="success">
      {{ $t("sites.emailChange.message." + status) }}
    </p>
    <p v-if="status === 'alreadyChanged'" class="error">
      {{ $t("sites.emailChange.message." + status) }}
    </p>
    <br />

    <RouterLink to="/login">
      {{ $t("sites.emailChange.links.login") }}
    </RouterLink>
  </template>
</template>
