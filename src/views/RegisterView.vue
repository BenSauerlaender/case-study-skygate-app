<script setup lang="ts">
import Form from "@/components/RegistrationForm.vue";
</script>

<template>
  <h1 class="heading">{{ $t("sites.register.name") }}</h1>

  <Form />
  <br />
  <br />

  <RouterLink to="/login">{{
    $t("sites.register.links.alreadyRegistered")
  }}</RouterLink>
</template>
