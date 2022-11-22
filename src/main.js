import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import styles from "./styles/styles.scss";
import KProgress from "k-progress-v3";
import VCalendar from "v-calendar";
import 'v-calendar/dist/style.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.component("k-progress", KProgress);
app.use(VCalendar, {});

app.mount("#app");
