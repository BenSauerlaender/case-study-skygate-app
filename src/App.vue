<script setup lang="ts">
import { RouterView } from "vue-router";
import TheFooter from "@/components/TheFooter.vue";
import TheHeader from "@/components/TheHeader.vue";
import TheLogoutHandler from "./components/TheLogoutHandler.vue";
</script>
<!-- simple header-content-footer layout -->
<template>
  <TheHeader />
  <main>
    <RouterView />
  </main>
  <TheFooter />
  <!-- plus one headless utility component -->
  <TheLogoutHandler />
</template>

<style>
@import "@/assets/base.css";

#app {
  margin: 0 auto;
  font-weight: normal;
  min-height: 100vh;
  display: grid;
  grid-template-columns: [start] auto [left-border] minmax(0px, 1280px) [right-border] auto [end];
  grid-template-rows: auto 1fr auto;
  align-content: stretch;
}

main {
  padding: 2rem;
  grid-column: left-border / right-border;
  grid-row: 2 / 2;
}
</style>
