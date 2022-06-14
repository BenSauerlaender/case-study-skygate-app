<script setup lang="ts">
import type { SearchQuery } from "@/helper/types";
import { computed } from "@vue/reactivity";
import { toRefs } from "vue";
const props = defineProps<{
  query: SearchQuery; //the current search query
  fullResultsLength: number; //The number of users (over all pages)
  sitePath: string; //the router-path of the current site
}>();
const { query, fullResultsLength } = toRefs(props);

const pageIndex = computed(() => {
  return parseInt(query.value.index!);
});

const pageSize = computed(() => {
  return parseInt(query.value.page!);
});

//the number of available pages
const pageCount = computed(() => {
  return Math.ceil(fullResultsLength.value / pageSize.value);
});

//function to get a copy of the current query, but with a different page
const getQueryForPage = (page: number) => {
  const newQuery = { ...query.value };
  newQuery.index = `${page - 1}`; //string -> int -> string conversion
  return newQuery;
};
</script>

<!-- Component that provides a list of all available pages with links to these -->
<template>
  <div>
    {{ $t("components.tablePageSelector.messages.pages") }}
    <template v-for="pageNumber in pageCount">
      <!-- if its the current page -> render bold and without link -->
      <span v-if="pageNumber === pageIndex + 1" class="bold">
        {{ pageNumber }}
      </span>
      <!-- otherwise -> with link -->
      <RouterLink
        v-else
        :to="{ path: props.sitePath, query: getQueryForPage(pageNumber) }"
      >
        <span>
          {{ pageNumber }}
        </span>
      </RouterLink>
    </template>
  </div>
</template>

<style scoped>
span {
  margin-left: 2px;
}

.bold {
  font-weight: bolder;
}
</style>
