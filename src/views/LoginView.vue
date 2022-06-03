<script setup lang="ts">
import router from "@/router";
import { ref, type Ref } from "vue";
import { sendLogin, type LoginErrorType } from "@/helper/backendInterface";

const email = ref("");
const password = ref("");

const error: Ref<LoginErrorType> = ref("");

function login(event: Event) {
  sendLogin(
    email.value,
    password.value,
    (success: boolean, err: LoginErrorType) => {
      if (success) {
        router.push("/profile");
      } else {
        error.value = err;
      }
    }
  );
}
</script>

<template>
  <h1 class="heading">{{ $t("sites.login.name") }}</h1>
  <label for="email">{{ $t("inputFields.email.label") }}</label>
  <br />
  <input id="email" v-model="email" />
  <br />
  <label for="password">{{ $t("inputFields.password.label") }}</label>
  <br />
  <input type="password" id="password" v-model="password" />
  <br />
  <br />
  <button @click="login">{{ $t("sites.login.buttons.login") }}</button>
  <br />
  <div id="error">
    <h3 v-if="error === 'noUser'">
      {{ $t("sites.login.messages.noUser") }}
    </h3>
    <h3 v-if="error === 'wrongPassword'">
      {{ $t("sites.login.messages.wrongPassword") }}
    </h3>
    <h3 v-if="error === 'noResponse'">
      {{ $t("messages.connectionError") }}
    </h3>
  </div>
  <br />
  <RouterLink to="/register">{{
    $t("sites.login.links.noAccount")
  }}</RouterLink>
</template>
<style scoped>
#error {
  color: var(--color-error);
}
</style>
