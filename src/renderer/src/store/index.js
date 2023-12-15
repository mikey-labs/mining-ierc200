import { createStore } from 'vuex';
import user, { WT_SIGN } from './modules/user';
const store = createStore({
  modules: {
    user
  }
});
const userInfoStr = localStorage.getItem(WT_SIGN);
if (userInfoStr) {
  const info = JSON.parse(decodeURIComponent(atob(userInfoStr)));

  store.dispatch('login', info).catch(()=>{
    localStorage.removeItem(WT_SIGN);
  });
}
export default store;
