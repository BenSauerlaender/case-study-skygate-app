<script setup lang="ts">
import type { SearchResult } from "@/stores/store";
import { toRefs } from "vue";
const props = defineProps<{
  data: Array<SearchResult>;
}>();
const { data } = toRefs(props);
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>{{ $t("userProps.name.short") }}</th>
        <th>{{ $t("userProps.email.short") }}</th>
        <th>{{ $t("userProps.postcode.short") }}</th>
        <th>{{ $t("userProps.city.short") }}</th>
        <th>{{ $t("userProps.phone.short") }}</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in data">
        <td>{{ row.name }}</td>
        <td>{{ row.email }}</td>
        <td>{{ row.postcode }}</td>
        <td>{{ row.city }}</td>
        <td>{{ row.phone }}</td>
        <td>
          <RouterLink :to="`/user/${row.id}`"> -> </RouterLink>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<style scoped>
table {
  border-collapse: collapse;
  border: 3px solid #44475c;
  margin: 10px 10px 0 10px;
}

table th {
  font-weight: bolder;
  padding: 8px;
  min-width: 30px;
  border-right: 2px solid #44475c;
  border-bottom: 3px solid #44475c;
}

table td {
  text-align: left;
  padding: 8px;
  border-right: 2px solid #7d82a8;
}
table td:last-child {
  border-right: none;
}
</style>
