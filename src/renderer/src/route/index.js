import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '../views/LandingPage/Index.vue';
import MintMain from '../views/Mint/Main/Index.vue';
import Runner from '../views/Mint/Runner/Index.vue';
import POWMain from '../views/POW/Main/Index.vue';
import ERSMain from '../views/ERS/Main/Index.vue';
import ToolsMain from '../views/Tools/Main/Index.vue';
import StatisticsMain from '../views/Statistics/Main/Index.vue';
const routes = [
  { path: '/', component: LandingPage },
  { path: '/mint/main', component: MintMain },
  { path: '/mint/runner', component: Runner },
  { path: '/pow/main', component: POWMain },
  { path: '/ers/main', component: ERSMain },
  { path: '/tools/main', component: ToolsMain },
  { path: '/statistics/main', component: StatisticsMain }
];
const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHistory('app'),
  routes // short for `routes: routes`
});
export default router;
