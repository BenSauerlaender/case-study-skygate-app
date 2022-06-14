<script setup lang="ts">
import SearchUsers from "../components/SearchUsers.vue";
</script>

<!-- page that let the user do a search query to find other users + show the results in a table -->
<template>
  <h1 class="heading">{{ $t("sites.search.name") }}</h1>
  <br />
  <SearchUsers />
</template>

<style scoped></style>
