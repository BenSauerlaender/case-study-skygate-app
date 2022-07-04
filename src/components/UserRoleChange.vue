<script setup lang="ts">
import { useStore } from "@/stores/store";
import { ref, type Ref } from "vue";

const props = defineProps<{
  userID: number;
  currentRole: string;
}>();
const emit = defineEmits<{
  (e: "userChanged"): void;
}>();

const store = useStore();

const role = ref(props.currentRole);

const roles: Ref<string[] | undefined> = ref(undefined);
store.getRoles().then((v) => (roles.value = v));

const changeRole = (role: string) =>
  store
    .updateUsersRole(props.userID, role)
    .then(async () => {
      emit("userChanged");
      await store.fetchAccessToken();
      status.value = "successful";
    })
    .catch(() => {
      status.value = "error";
    });

//the current status of the form
const status: Ref<"pending" | "waiting" | "error" | "successful"> =
  ref("waiting");

//event triggered by submit button click: requests the input-field-values
const onSubmit = (event: Event) => {
  //allow only if there is currently no processing submit
  if (status.value !== "pending") {
    status.value = "pending";
    changeRole(role.value);
  }
};
</script>

<!-- Component to request a users email change-->
<template v-if="roles">
  <label for="roleSelector">{{ $t("components.roleChange.label") }}</label>
  <br />

  <select id="roleSelector" v-model="role">
    <option v-for="r in roles" :value="r">{{ r }}</option>
  </select>
  <br />
  <br />

  <button @click="onSubmit">
    {{ $t("components.roleChange.buttons.change") }}
  </button>
  <br />

  <!-- pending, error, success message  -->
  <h3 v-if="status === 'pending'">{{ $t("messages.loading") }}</h3>
  <h3 class="success" v-if="status === 'successful'">
    {{ $t("components.roleChange.messages.successful") }}
  </h3>
  <h3 class="error" v-if="status === 'error'">{{ $t("messages.ApiError") }}</h3>
</template>
<style scoped></style>
