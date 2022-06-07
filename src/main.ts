import { createApp } from "vue";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";
import languageMessages from "./assets/language.json";

import App from "./App.vue";
import router from "./router";
import axios from "axios";
import { useStore } from "./stores/store";

axios.defaults.withCredentials = true;

const i18n = createI18n({
  legacy: false, // you must set `false`, to use Composition API
  locale: "de", // set locale
  messages: languageMessages,
  globalInjection: true,
});

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);

const store = useStore();
await store.loginSilently();

app.use(router);
app.use(i18n);

app.mount("#app");
