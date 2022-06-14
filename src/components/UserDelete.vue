<script setup lang="ts">
import { useStore } from "@/stores/store";
import { ref, type Ref } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  userID: number;
}>();
const emit = defineEmits<{
  (e: "userChanged"): void;
}>();
const store = useStore();

const error: Ref<null | true> = ref(null);

const { t } = useI18n();

//triggered by button
const deleteUser = () => {
  //let the user confirm the request
  if (confirm(t("components.deleteUser.messages.confirm"))) {
    store
      .deleteUser(props.userID)
      .then(() => {
        error.value = null;
        emit("userChanged");
      })
      .catch(() => {
        error.value = true;
      });
  }
};
</script>

<!-- Component to delete the user -->
<template>
  <button @click="deleteUser">
    {{ $t("components.deleteUser.buttons.delete") }}
  </button>
  <h3 class="error" v-if="error">
    {{ $t("messages.ApiError") }}
  </h3>
</template>
<style scoped></style>
