<script setup lang="ts">
import RegisterForm from "@/components/TheRegistrationForm.vue";
</script>

<!-- page with register form, to let the user register + link to login-page -->
<template>
  <h1 class="heading">{{ $t("sites.register.name") }}</h1>

  <RegisterForm />
  <br />

  <RouterLink to="/login">{{
    $t("sites.register.links.alreadyRegistered")
  }}</RouterLink>
</template>
