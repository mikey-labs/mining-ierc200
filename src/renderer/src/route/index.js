import { createRouter, createWebHashHistory } from 'vue-router';
import LandingPage from '../views/LandingPage/Index.vue';
import MintMain from '../views/Mint/Main/Index.vue';
import Runner from '../views/Mint/Runner/Index.vue';
import POWMain from '../views/POW/Main/Index.vue';
const routes = [
  { path: '/', component: LandingPage },
  { path: '/mint/main', component: MintMain },
  { path: '/mint/runner', component: Runner },
  { path: '/pow/main', component: POWMain }
];
const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHashHistory(),
  routes // short for `routes: routes`
});
export default router;
