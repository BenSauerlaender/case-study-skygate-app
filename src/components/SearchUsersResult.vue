<script setup lang="ts">
import { useStore } from "@/stores/store";
import type { PublicUser, SearchQuery } from "@/helper/types";
import { ref, watch, type Ref } from "vue";
import { useRoute, type LocationQuery } from "vue-router";
import SearchUsersResultTable from "./SearchUsersResultTable.vue";
import TablePageSelector from "./TablePageSelector.vue";
import { InvalidSearchError } from "../helper/errors";

const props = defineProps<{
  query: SearchQuery; //takes the query as input
}>();

const store = useStore();
const route = useRoute();

//string that will be shown if the query cant be executed
const apiError: Ref<null | string> = ref(null);

//A list of found users
const results: Ref<null | Array<PublicUser>> = ref(null);

//The number of found users (without pagination)
const fullResultsLength: Ref<null | number> = ref(null);

//function to fetch the users
const fetchResults = (query: LocationQuery) => {
  //get the length of results
  store
    .getSearchLength(query)
    .then((length) => {
      apiError.value = null;
      fullResultsLength.value = length;

      //if no user was found
      if (length === 0) {
        results.value = [];
      } else {
        //if the requested page is greater than the page count -> fetch the last page
        const pageIndex = parseInt(query.index as string);
        const pageSize = parseInt(query.page as string);
        if (pageIndex * pageSize >= length) {
          query.index = "" + (Math.ceil(length / pageSize) - 1);
        }
        //fetch the actual users
        store.getSearchResults(query).then((res) => (results.value = res));
      }
    })
    .catch((error) => {
      results.value = null;
      fullResultsLength.value = null;
      if (error instanceof InvalidSearchError) {
        apiError.value = "sites.search.messages.invalidSearch";
      } else {
        apiError.value = "messages.ApiError";
      }
    });
};
//fetch the result
fetchResults(props.query);

//fetch again if the query change
watch(
  () => props.query,
  (query) => {
    if (query) {
      fetchResults(query);
    }
  }
);
</script>

<!-- Component that provide a search result for a given query -->
<template>
  <div id="result-wrapper">
    <!-- show error if there is one -->
    <div v-if="apiError" class="error">{{ $t(apiError) }}</div>

    <!-- show message if there are no results -->
    <h1 v-if="results?.length === 0">
      {{ $t("sites.search.messages.noResults") }}
    </h1>

    <!-- otherwise show the results -->
    <template v-else-if="results">
      <!-- display how many users were found -->
      <p>
        {{
          $t("sites.search.messages.resultsFound", {
            resultLength: fullResultsLength,
          })
        }}
      </p>

      <!-- display the results in a table -->
      <SearchUsersResultTable :data="results" />

      <!-- show a list of pages with links to them -->
      <TablePageSelector
        :query="props.query"
        :full-results-length="fullResultsLength!"
        :site-path="route.path"
      />
    </template>
  </div>
</template>
<style scoped>
#result-wrapper {
  display: grid;
  grid-template-columns: 1fr;
  text-align: center;
}
</style>
