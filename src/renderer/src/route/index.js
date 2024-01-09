import { createRouter, createWebHashHistory } from 'vue-router';
import LandingPage from '../views/LandingPage/Index.vue';
import MintMain from '../views/Mint/Main/Index.vue';
const routes = [
  { path: '/', component: LandingPage },
  { path: '/mint/main', component: MintMain },
  { path: '/mint/runner', component: ()=>import('../views/Mint/Runner/Index.vue') },
  { path: '/pow/main', component: ()=>import('../views/POW/Main/Index.vue') },
  { path: '/ers/main', component: ()=>import('../views/ERS/Main/Index.vue') },
  { path: '/tools/main', component: ()=>import('../views/Tools/Main/Index.vue') },
  { path: '/statistics/main', component: ()=>import('../views/Statistics/Main/Index.vue') },
  { path: '/pow/monitor', component: () => import('../views/POW/Monitor/Index.vue') }
];
const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHashHistory('app'),
  routes // short for `routes: routes`
});
export default router;
