import { createRouter, createWebHashHistory } from 'vue-router'
import Main from '../views/Main/Index.vue';
import Runner from '../views/Runner/Index.vue';
const routes = [
  { path: '/', component: Main },
  { path: '/runner', component: Runner }
];
const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHashHistory(),
  routes // short for `routes: routes`
})
export default router;
