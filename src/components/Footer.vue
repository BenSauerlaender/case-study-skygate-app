<script setup lang="ts"></script>

<template>
  <footer>
    <div id="content">
      <nav>
        <RouterLink to="/privacy">{{ $t("sites.privacy.name") }}</RouterLink>
        <RouterLink to="/terms-of-use">{{
          $t("sites.termsOfUse.name")
        }}</RouterLink>
      </nav>
    </div>
  </footer>
</template>

<style scoped>
footer {
  width: 100%;
  background-color: var(--color-background-dark);
  grid-column: start / end;
  grid-row: 3 / 3;
  display: grid;
  grid-template-columns: [start] auto [left-border] minmax(0px, 1280px) [right-border] auto [end];
}
#content {
  padding-left: 2rem;
  padding-right: 2rem;
  padding-bottom: 1rem;
  padding-top: 1rem;
  grid-column: left-border / right-border;
}

nav {
  font-size: 1rem;
  text-align: left;
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
