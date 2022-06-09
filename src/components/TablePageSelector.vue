<script setup lang="ts">
import type { SearchQuery, SearchResult } from "@/stores/store";
import { computed } from "@vue/reactivity";
import { toRefs } from "vue";
const props = defineProps<{
  query: SearchQuery;
  fullLength: number;
  sitePath: string;
}>();
const { query, fullLength } = toRefs(props);

const index = computed(() => {
  return parseInt(query.value.index!);
});
const pageSize = computed(() => {
  return parseInt(query.value.page!);
});

const getQuery = (page: number) => {
  const ret = { ...query.value };
  ret.index = `${page - 1}`;
  return ret;
};

const pages = computed(() => {
  return Math.ceil(fullLength.value / pageSize.value);
});
</script>

<template>
  <div>
    {{ $t("components.tablePageSelector.messages.pages") }}
    <template v-for="num in pages">
      <span v-if="num === index + 1" class="bold">
        {{ num }}
      </span>
      <RouterLink v-else :to="{ path: props.sitePath, query: getQuery(num) }">
        <span>
          {{ num }}
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
