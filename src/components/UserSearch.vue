<script setup lang="ts">
import {
  useStore,
  type User,
  type BaseUser,
  type SearchQuery,
} from "@/stores/store";
import { ref, watch, type Ref } from "vue";
import { useRoute, useRouter, type LocationQuery } from "vue-router";
import UserTable from "./UserTable.vue";
import TablePageSelector from "./TablePageSelector.vue";
import { InvalidSearchError } from "./../helper/errors";

const router = useRouter();
const route = useRoute();

const pageSizes = ["10", "20", "50"];

const store = useStore();

const props: Array<keyof BaseUser> = [
  "email",
  "postcode",
  "name",
  "city",
  "phone",
];

const sortBy = ref(props[0]);
const sortASC = ref(true);
const searchFields: Ref<Map<keyof User, string>> = ref(new Map());
const pageSize: Ref<string> = ref(pageSizes[0]);

const apiError: Ref<null | string> = ref(null);
const results: Ref<null | Array<any>> = ref(null);
const fullLength: Ref<null | number> = ref(null);

watch(
  () => route.query,
  (query) => {
    if (route.path === "/search") {
      executeSearch(query);
    }
  }
);

executeSearch(route.query);

function executeSearch(query: LocationQuery): void {
  const q = checkQuery(query);
  if (!q) return;

  updateSearchFields(q);

  store
    .getSearchLength(q)

    .then((length) => {
      apiError.value = null;
      fullLength.value = length;

      if (length === 0) {
        results.value = [];
      } else {
        if (q.index && q.page) {
          const intIndex = parseInt(q.index);
          const intPage = parseInt(q.page);
          if (isNaN(intIndex) || intIndex < 0) {
            q.index = "0";
            router.replace({ path: route.path, query: q });
            return;
          } else if (intIndex * intPage >= length) {
            q.index = "" + (Math.ceil(length / intPage) - 1);
            router.replace({ path: route.path, query: q });
            return;
          }
        }
        store.getSearchResults(q).then((res) => (results.value = res));
      }
    })
    .catch((error) => {
      results.value = null;
      fullLength.value = null;
      if (error instanceof InvalidSearchError) {
        apiError.value = "sites.search.messages.invalidSearch";
      } else {
        apiError.value = "messages.connectionError";
      }
    });
}

function checkQuery(inputQuery: LocationQuery): SearchQuery | false {
  const query = { ...inputQuery };
  //remove unsupported keys
  Object.keys(query).forEach((key) => {
    if (![...props, "page", "index", "sortby", "DESC"].includes(key)) {
      delete query[key];
    } else if (key !== "DESC" && query[key]!.length === 0) {
      delete query[key];
    }
  });
  if (!pageSizes.includes(`${query["page"]}`)) {
    query["page"] = pageSizes[0];
  }
  if (!query["sortby"]) {
    query["sortby"] = props[0];
  }
  if (!query["index"]) {
    query["index"] = "0";
  }

  if (JSON.stringify(query) != JSON.stringify(inputQuery)) {
    router.replace({ path: route.path, query: query });
    return false;
  } else {
    return query;
  }
}

function updateSearchFields(query: SearchQuery) {
  props.forEach((key) => {
    const queryValue = query[key] ?? "";
    searchFields.value.set(key, queryValue);
  });
  sortASC.value = query["DESC"] !== null;
  if (query["page"]) {
    pageSize.value = query["page"];
  }
  if (query["sortby"]) {
    sortBy.value = query["sortby"];
  }
}

function updateQuery() {
  const query = route.query;
  if (!query) return;
  const nextQuery: SearchQuery = {};
  props.forEach((key) => {
    nextQuery[key] = searchFields.value.get(key) ?? "";
  });
  nextQuery["sortby"] = sortBy.value;
  if (!sortASC.value) {
    nextQuery["DESC"] = null;
  }
  nextQuery["page"] = pageSize.value;
  nextQuery["index"] = "0";
  (Object.keys(nextQuery) as Array<keyof SearchQuery>).forEach((key) => {
    const value = nextQuery[key];
    if (value?.length === 0) delete nextQuery[key];
  });
  if (JSON.stringify(query) != JSON.stringify(nextQuery)) {
    router.push({ path: route.path, query: nextQuery });
  }
}
</script>

<template v-if="query">
  <div id="frame">
    <div v-for="prop in props">
      <label :for="prop">{{ $t("userProps." + prop + ".short") }}: </label>
      <input
        id="email"
        :value="searchFields.get(prop)"
        @input=" e => searchFields.set(prop, (e.target! as HTMLInputElement).value)"
      />
    </div>
  </div>
  <br />
  <div>
    {{ $t("sites.search.messages.sort") }}:
    <select v-model="sortBy">
      <option v-for="prop in props" :value="prop">
        {{ $t("userProps." + prop + ".short") }}
      </option>
    </select>
    <select v-model="sortASC">
      <option :value="true">
        {{ $t("sites.search.messages.sorting.asc") }}
      </option>
      <option :value="false">
        {{ $t("sites.search.messages.sorting.desc") }}
      </option>
    </select>
    <br />
    {{ $t("sites.search.messages.resultsPerPage") }}
    <select v-model="pageSize">
      <option v-for="page in pageSizes">
        {{ page }}
      </option>
    </select>
  </div>
  <div id="button-wrapper">
    <div v-if="apiError" id="error">{{ $t(apiError) }}</div>
    <button @click="updateQuery">
      {{ $t("sites.search.buttons.search") }}
    </button>
  </div>
  <div id="result-wrapper" v-if="results">
    <h1 v-if="results.length === 0">
      {{ $t("sites.search.messages.noResults") }}
    </h1>
    <template v-else>
      <p>
        {{
          $t("sites.search.messages.resultsFound", { resultLength: fullLength })
        }}
      </p>
      <UserTable :data="results" />
      <TablePageSelector
        :query="route.query"
        :full-length="fullLength!"
        :site-path="route.path"
      />
    </template>
  </div>
</template>
<style scoped>
#error {
  text-align: center;

  color: var(--color-error);
}
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
