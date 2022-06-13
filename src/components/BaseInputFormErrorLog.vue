<script setup lang="ts">
const props = defineProps<{
  errorMap: Map<string, string[]>;
}>();
</script>

<!-- component used in BaseInputForm to show a list of reasons for each invalid field-->
<template>
  <div>
    <div v-for="topic in props.errorMap">
      <p>{{ $t("inputFields." + topic[0] + ".label") }}</p>
      <li v-for="errors in topic[1]">{{ `${$t(errors)}` }}</li>
    </div>
  </div>
</template>

<style scoped>
li {
  margin-left: 20px;
}
* {
  color: var(--color-invalid-input);
}
p {
  font-weight: bolder;
}
</style>
