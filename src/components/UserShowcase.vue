<script setup lang="ts">
import type { User, UserWithID } from "@/stores/store";
import UserDataView from "./UserDataView.vue";
import ContactDataChange from "./ContactDataChange.vue";
import PasswordChange from "./PasswordChange.vue";
import EmailChange from "./EmailChange.vue";
import { computed, toRefs, type ComputedRef } from "vue";

const props = defineProps<{
  user: UserWithID;
}>();

const { user } = toRefs(props);

const userWithoutID: ComputedRef<User> = computed(() => {
  let u = { ...user.value } as any;
  delete u.id;
  return u;
});
</script>

<template>
  <div class="section">
    <UserDataView :user="userWithoutID" />
  </div>
  <br />
  <h1>{{ $t("components.userShowcase.header.changeContactData") }}</h1>
  <div class="section">
    <ContactDataChange :user="user" />
  </div>
  <br />
  <h1>{{ $t("components.userShowcase.header.changeEmail") }}</h1>
  <div class="section">
    <!--<EmailChange :userID="user.id" />-->
  </div>
  <br />
  <h1>{{ $t("components.userShowcase.header.changePassword") }}</h1>
  <div class="section">
    <!--<PasswordChange :userID="user.id" />-->
  </div>
</template>
<style scoped>
.section {
  background-color: var(--color-background-soft);
}
</style>
