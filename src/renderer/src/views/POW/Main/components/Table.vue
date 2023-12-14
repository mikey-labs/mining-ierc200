<script setup>
import { BigNumber, utils } from 'ethers';
import { checkIsBuyPending } from '../../../../api/pow';
import { formatNumber } from '../../../../util';
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  unitPrice: {
    type: Number,
    default: 0
  },
  floorPrice: {
    type: Number,
    default: 0
  }
});
const audio = new Audio('/329.wav');

const formatAddress = (str) => {
  return str.substring(0, 6) + '...' + str.substring(str.length - 4, str.length);
};
const formatPrice = (value) => {
  return formatNumber(value * props.unitPrice, 6);
};
const checkHighLine = (unitPrice) => {
  const wei = BigNumber.from(props.floorPrice);
  // console.log(unitPrice,utils.formatEther(wei), unitPrice / utils.formatEther(wei));
  const isOk = unitPrice / utils.formatEther(wei) <= 0.4;
  if (isOk) {
    audio.play();
  }
  return isOk;
};
const gotoMarket = (item) => {
  const { sign, tick } = item;
  checkIsBuyPending({
    signature: sign,
    tick
  }).then((canBuy) => {
    if (canBuy) {
    }
  });
  // window.open('https://www.ierc20.com/market/' + selectValue.value.value, '_blank');
};
</script>

<template>
  <table class="table">
    <thead>
      <tr>
        <td>名称</td>
        <td>出售数量</td>
        <td>单价</td>
        <td>卖家地址</td>
        <td>总价</td>
        <td>操作</td>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(item, i) in data"
        :key="i"
        :class="{
          highline: checkHighLine(item.value / item.amt)
        }"
      >
        <td>{{ item.tick }}</td>
        <td>{{ item.amt }}</td>
        <td style="color: #8f78f7">${{ formatPrice(item.value / item.amt) }}</td>
        <td>{{ formatAddress(item.creator) }}</td>
        <td>
          <div style="color: #ae6605">
            <span style="color: #999; font-size: 12px">ETH:</span>
            {{ formatNumber(item.value, 6) }}
          </div>
          <div style="color: #8f78f7">
            <span style="color: #999; font-size: 12px">USD:</span>
            {{ formatPrice(item.value) }}
          </div>
        </td>
        <td>
          <div class="op" @click="gotoMarket(item)">去交易</div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped lang="less">
.table {
  width: 100%;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  font-size: 14px;
  color: #86a5b1;
  thead {
    tr td {
      background: #404040;
      color: #999;
      padding: 8px 16px;
    }
  }
  tr td {
    border: 1px solid #464646;
    padding: 4px 16px;
  }
  .highline td {
    background: red;
    animation: flashing 0.2s infinite;
  }
  tbody {
    tr td {
      background: #303030;
    }
  }
  .op {
    color: #c1b3ff;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
