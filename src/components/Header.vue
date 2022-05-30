<script setup lang="ts"></script>

<template>
  <header>
    <div>
      <h1 class="green">Case-Study-Skygate-App</h1>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
header div {
  width: 100%;
  background-color: blue;
  top: 0px;
}
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}
</style>
