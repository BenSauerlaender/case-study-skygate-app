<script setup lang="ts">
import { NoUserError, BadPasswordError, ApiError } from "@/helper/errors";
import router from "@/router";
import { useStore } from "@/stores/store";
import { ref, type Ref } from "vue";

const store = useStore();

//input refs
const email = ref("");
const password = ref("");

//apiError response
const apiError: Ref<ApiError | null> = ref(null);

//logs the user in and redirect to profile-page. If error occurred -> show error message
function login(event: Event) {
  store
    .loginUser(email.value, password.value)
    .then(() => router.push("/profile"))
    .catch((err) => {
      apiError.value = err;
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
    <h3 v-if="apiError instanceof NoUserError">
      {{ $t("sites.login.messages.noUser") }}
    </h3>
    <h3 v-else-if="apiError instanceof BadPasswordError">
      {{ $t("sites.login.messages.wrongPassword") }}
    </h3>
    <h3 v-else-if="apiError instanceof ApiError">
      {{ $t("messages.ApiError") }}
    </h3>
  </div>
</template>
<style scoped></style>
