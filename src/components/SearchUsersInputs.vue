<script setup lang="ts">
import type { SearchQuery } from "@/helper/types";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { textInputKeys, pageSizes } from "@/helper/searchQuery";

const props = defineProps<{
  defaultQuery: SearchQuery; //takes a (start) query as input
}>();

const query = ref(props.defaultQuery);

const router = useRouter();
const route = useRoute();

//triggered by search button
const search = () => {
  //request the first page of the new search query
  query.value.index = "0";

  //remove all empty text inputs
  (Object.keys(query) as Array<keyof SearchQuery>).forEach((key) => {
    const value = query.value[key];
    if (typeof value === "string")
      if (value.length === 0) delete query.value[key];
  });

  //check if the query differs from the current
  if (JSON.stringify(query) != JSON.stringify(props.defaultQuery)) {
    //reload the page with updated query
    router.push({ path: route.path, query: query.value });
  }
};
</script>

<!-- Component that provide a searchForm for the users table -->
<template>
  <!-- text input fields for each user property -->
  <div id="frame">
    <div v-for="key in textInputKeys">
      <label :for="key">{{ $t("userProps." + key + ".short") }}: </label>
      <input v-model="query[key]" :id="key" />
    </div>
  </div>
  <br />

  <!-- additional options -->
  <div>
    <!-- sort options -->
    {{ $t("sites.search.messages.sort") }}:
    <select v-model="query.sortby">
      <option v-for="key in textInputKeys" :value="key">
        {{ $t("userProps." + key + ".short") }}
      </option>
    </select>
    <select v-model="query.DESC">
      <option :value="undefined">
        {{ $t("sites.search.messages.sorting.asc") }}
      </option>
      <option :value="null">
        {{ $t("sites.search.messages.sorting.desc") }}
      </option>
    </select>
    <br />

    <!-- entries per page option -->
    {{ $t("sites.search.messages.resultsPerPage") }}
    <select v-model="query.page">
      <option v-for="pageSize in pageSizes">
        {{ pageSize }}
      </option>
    </select>
  </div>

  <!-- search button -->
  <div id="button-wrapper">
    <button @click="search">
      {{ $t("sites.search.buttons.search") }}
    </button>
  </div>
</template>
<style scoped>
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
