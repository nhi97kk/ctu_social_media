import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import timeago from "vue-timeago3";

import "bootstrap/dist/css/bootstrap.min.css";
import "jquery/dist/jquery.slim.min.js";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@/assets/css/style.css";
import "vue-toast-notification/dist/theme-sugar.css";
import "sweetalert2/dist/sweetalert2.min.css";

const pinia = createPinia();
const app = createApp(App);

// Pinia config
app.use(pinia);

// Router config
app.use(router);

app.use(timeago);

// Handling error
app.config.errorHandler = (error, vm, info) => {
  console.log(`Error: ${error.toString()}\nInfo: ${info}`);
};

// Mount app
app.mount("#app");
