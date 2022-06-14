<script setup lang="ts">
import { toRefs } from "vue";
import { contactDataKeys, emailKeys, type PublicUser } from "@/helper/types";
const props = defineProps<{
  data: Array<PublicUser>;
}>();
const { data } = toRefs(props);

const columns = [...emailKeys, ...contactDataKeys];
</script>

<!-- Component that renders a list of users as table with links to there /users/:id page -->
<template>
  <table>
    <thead>
      <tr>
        <!-- Header for each colum -->
        <th v-for="column in columns">
          {{ $t("userProps." + column + ".short") }}
        </th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in data">
        <td v-for="column in columns">{{ row[column] }}</td>
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
