import BigNumber from 'bignumber.js';

BigNumber.config({ EXPONENTIAL_AT: [-8, 30] });

const applyFunction = {
  toBigInt() {
    return BigInt(this.toString());
  },
  toHex() {
    let hex = this.dp(0).toString(16);
    if (hex === `0`) return `0x`;
    return `0x${hex}`;
  },
};

Object.assign(BigNumber.prototype, applyFunction);

export const bnUtils = {
  wrap: (tar) => {
    return new BigNumber(typeof tar === "bigint" ? tar.toString() : tar);
  },
  toWei: (tar, decimals) => {
    return bnUtils.wrap(tar).times(new BigNumber(10).pow(bnUtils.wrap(decimals)));
  },
  fromWei: (tar, decimals) => {
    return bnUtils.wrap(tar).div(new BigNumber(10).pow(bnUtils.wrap(decimals)));
  },
};
