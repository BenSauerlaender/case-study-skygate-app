<script setup lang="ts"></script>

<!-- static page, to message the user, that they password was changed -->
<template>
  <h1 class="heading">{{ $t("sites.passwordChanged.name") }}</h1>
  {{ $t("sites.passwordChanged.message") }}
</template>
