<script setup lang="ts">
import { useStore } from "@/stores/store";
import type { SearchQuery } from "@/helper/types";
import { ref, watch, type Ref } from "vue";
import { useRoute, type LocationQuery } from "vue-router";
import UserTable from "./UserTable.vue";
import TablePageSelector from "./TablePageSelector.vue";
import { InvalidSearchError } from "../helper/errors";

const props = defineProps<{
  query: SearchQuery;
}>();

const store = useStore();
const route = useRoute();

const apiError: Ref<null | string> = ref(null);
const results: Ref<null | Array<any>> = ref(null);
const fullLength: Ref<null | number> = ref(null);

function fetchResults(query: LocationQuery): void {
  store
    .getSearchLength(query)
    .then((length) => {
      apiError.value = null;
      fullLength.value = length;

      if (length === 0) {
        results.value = [];
      } else {
        const intIndex = parseInt(query.index as string);
        const intPage = parseInt(query.page as string);
        if (intIndex * intPage >= length) {
          query.index = "" + (Math.ceil(length / intPage) - 1);
        }
        store.getSearchResults(query).then((res) => (results.value = res));
      }
    })
    .catch((error) => {
      results.value = null;
      fullLength.value = null;
      if (error instanceof InvalidSearchError) {
        apiError.value = "sites.search.messages.invalidSearch";
      } else {
        apiError.value = "messages.ApiError";
      }
    });

  watch(
    () => props.query,
    (query) => {
      if (query) {
        fetchResults(query);
      }
    }
  );
}
</script>

<template>
  <div id="result-wrapper">
    <div v-if="apiError" class="error">{{ $t(apiError) }}</div>
    <h1 v-if="results?.length === 0">
      {{ $t("sites.search.messages.noResults") }}
    </h1>
    <template v-else-if="results">
      <p>
        {{
          $t("sites.search.messages.resultsFound", { resultLength: fullLength })
        }}
      </p>
      <UserTable :data="results" />
      <TablePageSelector
        :query="props.query"
        :full-length="fullLength!"
        :site-path="route.path"
      />
    </template>
  </div>
</template>
<style scoped>
button {
  margin-left: auto;
  margin-right: auto;
}

#result-wrapper {
  display: grid;
  grid-template-columns: 1fr;
  text-align: center;
}
#button-wrapper {
  margin-top: 20px;
  display: grid;
  grid-template-columns: 1fr;
}

#frame {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

#frame div {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  align-content: flex-end;
}
label {
  text-align: right;
  margin-right: 20px;
}

select {
  margin: 2px;
  margin-right: 20px;
}
input {
  margin: 2px;
  margin-right: 20px;
}
</style>
