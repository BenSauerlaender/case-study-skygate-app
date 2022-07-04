<script setup lang="ts">
import { useSearchQuery } from "@/helper/searchQuery";
import SearchUsersInputs from "@/components/SearchUsersInputs.vue";
import SearchUsersResult from "@/components/SearchUsersResult.vue";
import { useStore } from "@/stores/store";

const store = useStore();

const hasPermission = store.hasPermission("getAllUsers");

//parse the query from url and ensures the query is valid
const { query } = useSearchQuery();
</script>

<!-- page that let the user do a search query to find other users + show the results in a table -->
<template>
  <h1 class="heading">{{ $t("sites.search.name") }}</h1>
  <br />
  <!-- renders as soon as the query is validated and the user has the permission -->
  <template v-if="hasPermission && query !== null">
    <!-- input fields to change the search query  -->
    <SearchUsersInputs :default-query="query!" />

    <!-- renders the results -->
    <SearchUsersResult :query="query!" />
  </template>
  <template v-else>
    {{ $t("sites.search.messages.noPermission") }}
  </template>
</template>

<style scoped></style>
