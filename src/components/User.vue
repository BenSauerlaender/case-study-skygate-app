<script setup lang="ts">
import UserDataView from "./UserDataView.vue";
import ContactDataChange from "./UserContactDataChange.vue";
import PasswordChange from "./UserPasswordChange.vue";
import EmailChange from "./UserEmailChange.vue";
import DeleteUser from "./UserDelete.vue";
import { toRefs } from "vue";
import type { PublicUser } from "@/helper/types";

const props = defineProps<{
  user: PublicUser; //The user to show
  editable: boolean; //activates ContactData-/Email/Password-change and delete
}>();
const { user, editable } = toRefs(props);

const emit = defineEmits<{
  (e: "userChanged"): void; //Tell the parent that this component has changed the user data
}>();
</script>

<!-- Component to show and edit user data -->
<template>
  <!-- Show user data -->
  <div class="section">
    <UserDataView :user="user" />
  </div>
  <br />

  <!-- Edit user data -->
  <template v-if="editable">
    <!-- Edit user contact data -->
    <h1>{{ $t("components.userShowcase.headers.changeContactData") }}</h1>
    <div class="section">
      <ContactDataChange :user="user" @userChanged="emit('userChanged')" />
    </div>
    <br />

    <!-- Request a email change -->
    <h1>{{ $t("components.userShowcase.headers.changeEmail") }}</h1>
    <div class="section">
      <EmailChange :userID="user.id" :oldEmail="user.email" />
    </div>
    <br />

    <!-- Change users password -->
    <h1>{{ $t("components.userShowcase.headers.changePassword") }}</h1>
    <div class="section">
      <PasswordChange :userID="user.id" />
    </div>

    <!-- Edit user data -->
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
