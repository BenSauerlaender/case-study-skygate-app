<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import Header from "@/components/Header.vue";
</script>

<template>
  <Header />
  <div id="content-frame">
    <div id="content">
      <RouterView />
    </div>
  </div>
</template>

<style>
@import "@/assets/base.css";
#app {
  margin: 0 auto;
  font-weight: normal;
}

#content {
  max-width: 1280px;
  padding: 2rem;
}
#content-frame {
  display: flex;
  place-items: center;
}
</style>
