import axios from 'axios';
const fetch = axios.create({
  baseURL: 'https://www.metasoy.cn/web3/api/v1/okx/'
});
fetch.interceptors.response.use((response) => response.data);

export const getTakerVolume = (param) => {
  return fetch.request({
    url: 'taker-volume',
    params: param
  });
};
export const getMarketTrades = (param) => {
  return fetch.request({
    url: 'market-trades',
    params: param
  });
};

export const getTradeOrder = (param) => {
  return fetch.post('trade-order', param);
};
