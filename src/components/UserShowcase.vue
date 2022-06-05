<script setup lang="ts">
defineProps<{
  user: {
    name: string;
    email: string;
    postcode: string;
    city: string;
    phone: string;
  };
}>();
</script>

<template>
  <div v-for="(value, key) in $props.user"></div>
</template>
<style scoped></style>
