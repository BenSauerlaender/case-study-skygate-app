<script setup lang="ts">
import { useStore } from "@/stores/store";
import { storeToRefs } from "pinia";

const store = useStore();

const { loggedIn } = storeToRefs(store);
</script>

<template>
  <header>
    <div id="content">
      <RouterLink to="/"
        ><h1>{{ $t("app.name") }}</h1></RouterLink
      >
      <nav v-if="loggedIn === true">
        <RouterLink to="/profile">{{ $t("sites.profile.name") }}</RouterLink>
      </nav>
      <nav v-else>
        <RouterLink to="/login">{{ $t("sites.login.name") }}</RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
header {
  width: 100%;
  background-color: var(--color-background-dark);
  grid-column: start / end;
  grid-row: 1 / 1;
  display: grid;
  grid-template-columns: [start] auto [left-border] minmax(0px, 1280px) [right-border] auto [end];
}
#content {
  padding-left: 2rem;
  padding-right: 2rem;
  padding-bottom: 1rem;
  padding-top: 1rem;
  grid-column: left-border / right-border;
  display: grid;
  grid-template-columns: auto 20px 1fr;
}

nav {
  grid-column: 3 / 3;
  font-size: 1.3rem;
  text-align: right;
  margin-top: auto;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

h1 {
  text-align: left;
  font-weight: 500;
  font-size: 2.6rem;
  margin-top: auto;
  color: var(--color-heading);
}
</style>
