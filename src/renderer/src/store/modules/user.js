import { createRpcProvider } from '../../util';
import { ethers } from 'ethers';
export const WT_SIGN = 'WT_SIGN';
let wallet = null;
export default {
  state: {
  },
  mutations: {
    setWallet(state, wallet) {
      state.wallet = wallet;
    },
    logout() {
      wallet = null;
      localStorage.removeItem(WT_SIGN);
    }
  },
  actions: {
    login(ctx, { url, key }) {
      return new Promise((resolve, reject) => {
        try {
          const provider = createRpcProvider(url);
          wallet = new ethers.Wallet(key, provider);
          localStorage.setItem(
            WT_SIGN,
            btoa(encodeURIComponent(JSON.stringify({ url, key: key })))
          );
          resolve(wallet);
        } catch (e) {
          console.log(e);
          reject(e);
        }
      });
    }
  },
  getters: {
    wallet: () => wallet
  }
};
