<script setup lang="ts">
import { useStore, type User, type UserWithID } from "@/stores/store";
import { NoUserError } from "@/helper/errors";
import { storeToRefs } from "pinia";
import { computed, ref, watchEffect, type Ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import UserShowcase from "../components/UserShowcase.vue";

const store = useStore();

const route = useRoute();
const router = useRouter();
const user: Ref<null | UserWithID> = ref(null);

const { isAdmin } = storeToRefs(store);

const userChanged = () => {
  getUser();
};

const getUser = async () => {
  store
    .getUser(userID.value)
    .then((u) => {
      user.value = u;
    })
    .catch((err) => {
      if (err instanceof NoUserError) {
        router.replace("/404");
      }
    });
};

const userID = computed(() =>
  parseInt(
    typeof route.params.id === "string" ? route.params.id : route.params.id[0]
  )
);

watchEffect(async () => {
  if (!route.path.startsWith("/user")) return;
  if (store.accessTokenPayload!.id === userID.value) {
    router.replace("/profile");
    return;
  } else {
    getUser();
  }
});

if (user.value === null) {
}
</script>

<template>
  <h1 class="heading">{{ $t("sites.user.name") }}</h1>
  <br />
  <UserShowcase
    v-if="user"
    :user="user"
    :editable="isAdmin ?? false"
    @user-changed="userChanged"
  />
</template>
<style scoped></style>
