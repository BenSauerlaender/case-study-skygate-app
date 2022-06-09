<script setup lang="ts">
import type { User, UserWithID } from "@/stores/store";
import UserDataView from "./UserDataView.vue";
import ContactDataChange from "./ContactDataChange.vue";
import PasswordChange from "./PasswordChange.vue";
import EmailChange from "./EmailChange.vue";
import DeleteUser from "./DeleteUser.vue";
import { computed, toRefs, type ComputedRef } from "vue";

const props = defineProps<{
  user: UserWithID;
  editable: boolean;
}>();
const emit = defineEmits<{
  (e: "userChanged"): void;
}>();

const { user, editable } = toRefs(props);

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
  <template v-if="editable">
    <h1>{{ $t("components.userShowcase.headers.changeContactData") }}</h1>
    <div class="section">
      <ContactDataChange :user="user" @userChanged="emit('userChanged')" />
    </div>
    <br />
    <h1>{{ $t("components.userShowcase.headers.changeEmail") }}</h1>
    <div class="section">
      <EmailChange :userID="user.id" :oldEmail="user.email" />
    </div>
    <br />
    <h1>{{ $t("components.userShowcase.headers.changePassword") }}</h1>
    <div class="section">
      <PasswordChange :userID="user.id" />
    </div>
    <h1>{{ $t("components.userShowcase.headers.deleteUser") }}</h1>
    <div class="section">
      <DeleteUser :userID="user.id" @userChanged="emit('userChanged')" />
    </div>
  </template>
</template>
<style scoped>
.section {
  background-color: var(--color-background-soft);
}
</style>
