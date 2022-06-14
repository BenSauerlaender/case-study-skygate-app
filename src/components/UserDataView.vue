<script setup lang="ts">
import type { PublicUser } from "@/helper/types";
import { toRefs } from "vue";
const props = defineProps<{
  user: PublicUser;
}>();
const { user } = toRefs(props);
</script>

<!-- Component to show user data -->
<template>
  <div v-for="(value, key) in user">
    <!-- Filter out all unwanted keys -->
    <template
      v-if="['name', 'postcode', 'city', , 'phone', 'email'].includes(key)"
    >
      <h2>{{ $t(`userProps.${key}.long`) }}:</h2>
      {{ value }}
    </template>
  </div>
</template>
<style scoped></style>
