<script setup lang="ts"></script>

<template>
  <header>
    <div id="content">
      <RouterLink to="/"><h1>Case-Study-Skygate-App</h1></RouterLink>
      <nav>
        <RouterLink to="/login">Login</RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
header {
  width: 100%;
  background-color: var(--color-background-dark);
  grid-column: start / end;
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
