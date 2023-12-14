import axios from 'axios';
const fetch = axios.create({
  baseURL: 'https://service.ierc20.com/api/v1/'
});
fetch.interceptors.response.use((response) => response.data);

export const getIERC20OrderList = (param) => {
  return fetch.post('order/list', param);
};
export const getEthereumToUSD = () => {
  return fetch.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
};

export const getStatisticsByTick = (param) => {
  return fetch.post('ticks/list', param);
};

export const checkIsBuyPending = (param) => {
  return fetch.post('buy_pending/check', param).then(data=>data.data);
};
