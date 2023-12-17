import { createRpcProvider } from '../../util';
import { ethers } from 'ethers';
export const WT_SIGN = 'WT_SIGN';
let wallet = null;
export default {
  state: {
    isLogin: false
  },
  mutations: {
    setIsLogin(state, isLogin) {
      state.isLogin = isLogin;
    },
    logout(state) {
      wallet = null;
      state.isLogin = false;
      localStorage.removeItem(WT_SIGN);
    }
  },
  actions: {
    login({ commit }, { url, key }) {
      return new Promise((resolve, reject) => {
        try {
          const provider = createRpcProvider(url);
          wallet = new ethers.Wallet(key, provider);
          localStorage.setItem(
            WT_SIGN,
            btoa(encodeURIComponent(JSON.stringify({ url, key: key })))
          );
          commit('setIsLogin', true);
          resolve(wallet);
        } catch (e) {
          console.log(e);
          reject(e);
        }
      });
    }
  },
  getters: {
    wallet: () => wallet,
    isLogin: (state) => state.isLogin
  }
};
