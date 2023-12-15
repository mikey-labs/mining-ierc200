<script setup>
import { BigNumber, utils } from 'ethers';
import { checkIsBuyPending } from '../../../../api/pow';
import { formatAddress, formatNumber } from '../../../../util';
import { useStore } from 'vuex';
import Popover from '../../../../components/Popover.vue';
const store = useStore();
import { ref, computed } from 'vue';
import Button from '../../../../components/Button.vue';
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

const formatPrice = (value, dem = 6) => {
  return formatNumber(value * props.unitPrice, dem);
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
const currentOrder = ref({});
const showPopover = ref(false);
const canBuy = ref(true);
const currentGas = ref('0');
const balance = ref('0');
const loading = ref(false);
const totalPay = computed(() => {
  return currentOrder.value.value * 1.02;
});
const gotoMarket = async (item) => {
  currentOrder.value = item;
  const { wallet } = store.getters;
  if (!wallet) {
    alert('请先登录');
    return;
  }
  showPopover.value = true;
  const rest = await wallet.getBalance();
  const balanceWei = BigNumber.from(rest);
  balance.value = utils.formatEther(balanceWei);

  const { sign, tick } = item;

  checkIsBuyPending({
    signature: sign,
    tick
  }).then(async (can) => {
    canBuy.value = can;
    if (can) {
      const gas = await wallet.provider.getGasPrice();
      const wei = BigNumber.from(gas);
      currentGas.value = utils.formatEther(wei);
      console.log(currentGas.value);
    }
  });
  // window.open('https://www.ierc20.com/market/' + selectValue.value.value, '_blank');
};
const pay = () => {
  if (loading.value) return;
  if (canBuy.value && balance.value >= totalPay.value) {
    loading.value = true;
    console.log('pay');
    loading.value = false;
  }
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
          <div class="op" @click="gotoMarket(item)">购买</div>
        </td>
      </tr>
    </tbody>
  </table>
  <Popover v-model="showPopover" :title="'购买' + currentOrder.tick">
    <div class="body">
      <div>
        <div class="row">
          <span class="label">总价：</span>
          <span class="value">
            {{ currentOrder.value }} ETH ≈ ${{ formatPrice(currentOrder.value, 4) }}
          </span>
        </div>
        <div class="row">
          <span class="label">网络gas费：</span>
          <span class="value"
            >{{ formatNumber(currentGas, 4) }}ETH ≈ ${{ formatPrice(currentGas, 4) }}</span
          >
        </div>
        <div class="row last">
          <span class="label">ierc20服务费：<span style="color: #555">(2%)</span></span>
          <span class="value"
            >{{ formatNumber(currentOrder.value * 0.02, 4) }} ETH ≈ ${{
              formatPrice(currentOrder.value * 0.02, 4)
            }}</span
          >
        </div>
      </div>
      <div>
        <div class="row" style="margin-top: 16px">
          <span class="label">您将支付：</span>
          <span class="value total"
            >{{ formatNumber(totalPay, 4) }} ETH ≈ ${{ formatPrice(totalPay, 4) }}</span
          >
        </div>
        <div class="row">
          <span class="label">您的余额：</span>
          <span class="value rest"
            >{{ formatNumber(balance, 4) }} ETH ≈ ${{ formatPrice(balance, 4) }}</span
          >
        </div>
      </div>
      <Button
        :disable="!canBuy || balance < totalPay"
        height="52px"
        background="#AE6605"
        style="margin-top: 30px"
        @click="pay"
      >
        <span v-if="loading" class="flex">
          <img class="loading" src="../../../../assets/icon_loading.svg" />
          正在交易...
        </span>
        <span v-else>{{
          !canBuy ? '已经卖出' : balance < totalPay ? '余额不足' : '确认购买'
        }}</span>
      </Button>
    </div>
  </Popover>
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
.body {
  padding: 14px 40px 0;
  .row {
    display: flex;
    justify-content: space-between;
    align-items: end;
    margin-bottom: 8px;
    .label {
      color: #999;
      font-size: 14px;
    }
    .value {
      color: #ccc;
      font-size: 14px;
      &.total {
        font-size: 16px;
        font-weight: bold;
        color: #ae6605;
      }
      &.rest {
        font-size: 16px;
        font-weight: bold;
        color: #2a82e4;
      }
    }
    &.last {
      border-bottom: 1px solid #444;
      padding-bottom: 30px;
    }
  }
}
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.loading {
  animation: linear 1s infinite rotate;
}
</style>
