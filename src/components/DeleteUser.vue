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
const deleteUser = () => {
  if (confirm(t("components.deleteUser.messages.confirm"))) {
    store
      .deleteUser(props.userID)
      .then(() => {
        error.value = null;
        if (props.userID === store.user?.id) {
          store.logoutUser();
        }
        emit("userChanged");
      })
      .catch(() => {
        error.value = true;
      });
  }
};
</script>

<template>
  <button @click="deleteUser">
    {{ $t("components.deleteUser.buttons.delete") }}
  </button>
  <h3 id="error" v-if="error">
    {{ $t("messages.connectionError") }}
  </h3>
</template>
<style scoped>
#error {
  color: var(--color-error);
}
</style>
