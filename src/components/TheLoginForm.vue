<script setup lang="ts">
import { InvalidPropsError } from "@/helper/errors";
import router from "@/router";
import { useStore } from "@/stores/store";
import { ref } from "vue";

const store = useStore();

const email = ref("");
const password = ref("");

const error = ref("");

function login(event: Event) {
  store
    .loginUser(email.value, password.value)
    .then(() => router.push("/profile"))
    .catch((err) => {
      if (err instanceof InvalidPropsError) {
        error.value = err.message;
      } else {
        error.value = "noResponse";
      }
    });
}
</script>

<!-- component that provide a email and a password input field and a login button -->
<template>
  <!-- email field -->
  <label for="email">{{ $t("inputFields.email.label") }}</label>
  <br />
  <input id="email" v-model="email" />
  <br />
  <!-- password field -->
  <label for="password">{{ $t("inputFields.password.label") }}</label>
  <br />
  <input type="password" id="password" v-model="password" />
  <br />
  <br />
  <!-- login button -->
  <button @click="login">{{ $t("sites.login.buttons.login") }}</button>
  <br />
  <!-- error display -->
  <div class="error">
    <h3 v-if="error === 'noUser'">
      {{ $t("sites.login.messages.noUser") }}
    </h3>
    <h3 v-if="error === 'wrongPassword'">
      {{ $t("sites.login.messages.wrongPassword") }}
    </h3>
    <h3 v-if="error === 'noResponse'">
      {{ $t("messages.ApiError") }}
    </h3>
  </div>
</template>
<style scoped></style>
