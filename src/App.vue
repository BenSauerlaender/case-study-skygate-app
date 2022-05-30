<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import Footer from "@/components/Footer.vue";
import Header from "@/components/Header.vue";
</script>

<template>
  <Header />
  <main>
    <RouterView />
  </main>
  <Footer />
</template>

<style>
@import "@/assets/base.css";
#app {
  margin: 0 auto;
  font-weight: normal;
  display: grid;
  grid-template-columns: [start] auto [left-border] minmax(0px, 1280px) [right-border] auto [end];
  grid-template-rows: auto 1fr auto;
}

main {
  padding: 2rem;
  grid-column: left-border / right-border;
}
</style>
