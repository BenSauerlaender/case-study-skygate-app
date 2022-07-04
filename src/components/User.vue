<script setup lang="ts">
import UserDataView from "./UserDataView.vue";
import ContactDataChange from "./UserContactDataChange.vue";
import PasswordChange from "./UserPasswordChange.vue";
import EmailChange from "./UserEmailChange.vue";
import RoleChange from "./UserRoleChange.vue";
import DeleteUser from "./UserDelete.vue";
import { toRefs } from "vue";
import type { PublicUser } from "@/helper/types";
import { useStore } from "@/stores/store";
import { computed } from "@vue/reactivity";

const props = defineProps<{
  user: PublicUser; //The user to show
}>();
const { user } = toRefs(props);

const store = useStore();

//is the user to display the same as the logged in?
const isSelf = computed(() => store.accessTokenPayload?.id === user.value.id);

const showContactDataChange = computed(
  () =>
    (isSelf.value && store.hasPermission("changeOwnContactData")) ||
    store.hasPermission("changeAllUsersContactData")
);

const showPrivilegedEmailChange = computed(() =>
  store.hasPermission("changeAllUsersEmailPrivileged")
);

const showPrivilegedPasswordChange = computed(() =>
  store.hasPermission("changeAllUsersPasswordsPrivileged")
);

const showEmailChange = computed(
  () =>
    (isSelf.value && store.hasPermission("changeOwnEmail")) ||
    showPrivilegedEmailChange.value
);

const showPasswordChange = computed(
  () =>
    (isSelf.value && store.hasPermission("changeOwnPassword")) ||
    showPrivilegedPasswordChange.value
);

const showDelete = computed(
  () =>
    (isSelf.value && store.hasPermission("deleteSelf")) ||
    store.hasPermission("deleteAllUsers")
);

const showRoleChange = computed(() =>
  store.hasPermission("changeAllUsersRoles")
);

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

  <!-- Edit user contact data -->
  <template v-if="showContactDataChange">
    <h1>{{ $t("components.userShowcase.headers.changeContactData") }}</h1>
    <div class="section">
      <ContactDataChange :user="user" @userChanged="emit('userChanged')" />
    </div>
    <br />
  </template>

  <!-- Request a email change -->
  <template v-if="showEmailChange">
    <h1>{{ $t("components.userShowcase.headers.changeEmail") }}</h1>
    <div class="section">
      <EmailChange
        :userID="user.id"
        :privileged="showPrivilegedEmailChange"
        @userChanged="emit('userChanged')"
      />
    </div>
    <br />
  </template>

  <!-- Change users password -->
  <template v-if="showPasswordChange">
    <h1>{{ $t("components.userShowcase.headers.changePassword") }}</h1>
    <div class="section">
      <PasswordChange
        :userID="user.id"
        :privileged="showPrivilegedPasswordChange"
        @userChanged="emit('userChanged')"
      />
    </div>
  </template>

  <!-- Change users role -->
  <template v-if="showRoleChange">
    <h1>{{ $t("components.userShowcase.headers.changeRole") }}</h1>
    <div class="section">
      <RoleChange
        :userID="user.id"
        :currentRole="user.role"
        @userChanged="emit('userChanged')"
      />
    </div>
  </template>

  <!-- delete user -->
  <template v-if="showDelete">
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
