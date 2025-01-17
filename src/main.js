import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mount('#app');

// IndexedDB Initialization
import { initDB, populateUsers } from "../public/indexedDB";
(async () => {
  const db = await initDB();
  await populateUsers(db);
})();
