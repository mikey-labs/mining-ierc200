import axios from 'axios';
const fetch = axios.create({
  baseURL: 'https://service.ierc20.com/api/v1/'
});
fetch.interceptors.response.use((response) => response.data);

export const getIERC20OrderList = (param) => {
  return fetch.post('order/list', param);
};
export const getEthereumToUSD = () => {
  return fetch.get('price/eth');
};

export const getStatisticsByTick = (param) => {
  return fetch.post('ticks/list', param);
};

export const checkIsBuyPending = (param) => {
  return fetch.post('buy_pending/check', param).then((data) => data.data);
};
export const getErsVolumeInfo = () => {
  return fetch
    .get('https://www.metasoy.cn/web3/api/v1/ers/volume?t=' + Date.now().toString());
};
