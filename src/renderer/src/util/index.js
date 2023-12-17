import { ethers, utils } from 'ethers';
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
export const decodeTransactionData = (hex) => {
  const byteArray = new Uint8Array(
    hex
      .slice(2)
      .match(/.{1,2}/g)
      .map((byte) => parseInt(byte, 16))
  );
  return utils.toUtf8String(byteArray);
};

export const encodeTransactionData = (data) => {
  return utils.hexlify(utils.toUtf8Bytes(data));
};
