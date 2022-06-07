<script setup lang="ts">
import type { User } from "@/stores/store";
import { toRefs } from "vue";
const props = defineProps<{
  user: User;
}>();
const {user} = toRefs(props);
</script>

<template>
  <div v-for="(value, key) in user">
    <h2>{{ $t(`userProps.${key}.long`) }}:</h2>
    {{ value }}
  </div>
</template>
<style scoped></style>
