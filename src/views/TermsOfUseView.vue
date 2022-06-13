<script setup lang="ts">
import { useStore } from "@/stores/store";

const store = useStore();
</script>

<template>
  <h1 class="heading">{{ $t("sites.termsOfUse.name") }}</h1>
</template>
