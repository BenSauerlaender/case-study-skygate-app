<script setup lang="ts">
import { useStore, type User, type SearchQuery } from "@/stores/store";
import { ref, watch, type Ref } from "vue";
import { useRoute, useRouter, type LocationQuery } from "vue-router";
import UserTable from "./UserTable.vue";
import { InvalidSearchError } from "./../helper/errors";

const router = useRouter();
const route = useRoute();

const pageSizes = ["10", "20", "50"];

const store = useStore();

const props: Array<keyof User> = ["email", "postcode", "name", "city", "phone"];

const sortBy = ref(props[0]);
const sortASC = ref(true);
const searchFields: Ref<Map<keyof User, string>> = ref(new Map());

const apiError: Ref<null | string> = ref(null);

watch(() => route.query, executeSearch);
executeSearch(route.query);
function executeSearch(query: LocationQuery): void {
  const q = checkQuery(query);
  if (!q) return;

  updateSearchFields(q);

  store
    .getSearchLength(q)

    .then((length) => {
      apiError.value = null;
      console.log(length);
    })
    .catch((error) => {
      if (error instanceof InvalidSearchError) {
        apiError.value = "sites.search.messages.invalidSearch";
      } else {
        apiError.value = "messages.connectionError";
      }
    });
}

function checkQuery(inputQuery: LocationQuery): SearchQuery | false {
  const query = { ...inputQuery };
  console.log(query);
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
  if (!query["index"]) {
    query["index"] = "0";
  }

  if (JSON.stringify(query) != JSON.stringify(inputQuery)) {
    console.log("push");
    router.push({ path: route.path, query: query });
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
  nextQuery["page"] = pageSizes[0];
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
  </div>
  <div id="button-wrapper">
    <div v-if="apiError" id="error">{{ $t(apiError) }}</div>
    <button @click="updateQuery">
      {{ $t("sites.search.buttons.search") }}
    </button>
  </div>
  <UserTable />
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
