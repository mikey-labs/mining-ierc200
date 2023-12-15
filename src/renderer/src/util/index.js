import { ethers } from 'ethers';
export const formatNumber = (value, dem) => {
  return Number(Number(value).toFixed(dem));
};
export const formatAddress = (str, start = 6, end = 4) => {
  if (!str) return '';
  return str.substring(0, start) + '...' + str.substring(str.length - end, str.length);
};
export function createRpcProvider(network) {
  return new ethers.providers.JsonRpcProvider(network);
}
