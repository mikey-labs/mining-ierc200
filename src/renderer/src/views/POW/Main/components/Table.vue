<script setup>
import { BigNumber, ethers, utils } from 'ethers';
import { checkIsBuyPending } from '../../../../api/pow';
import { encodeTransactionData, formatAddress, formatNumber } from '../../../../util';
import Popover from '../../../../components/Popover.vue';
import { computed, ref } from 'vue';
import Button from '../../../../components/Button.vue';
import { ETHEREUM_RPC_MAIN, IERC20_ADDRESS } from '../../../../config/constant';
import { bnUtils } from '../../../Mint/Runner/bn';

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
const provider = new ethers.providers.JsonRpcProvider(ETHEREUM_RPC_MAIN[0].value);

const currentOrder = ref({});
const showPopover = ref(false);
const canBuy = ref(true);
const currentGas = ref(0);
const loading = ref(false);
const totalPay = computed(() => {
  return currentOrder.value.value * 1.02 + Number(utils.formatEther(currentGas.value));
});
const gotoMarket = async (item) => {
  currentOrder.value = item;
  showPopover.value = true;
  // const rest = await wallet.getBalance();
  // const balanceWei = BigNumber.from(rest);
  // balance.value = utils.formatEther(balanceWei);

  const { sign, tick } = item;

  checkIsBuyPending({
    signature: sign,
    tick
  }).then(async (can) => {
    canBuy.value = can;
    if (can) {
      // currentGas.value = BigNumber.from(gas).toString();

      currentGas.value = await getEstimateGas();
      //  const wei = BigNumber.from(gas);
      // console.log(currentGas.value);
    }
  });
};

const getEstimateGas = async () => {
  const gas = await provider.getGasPrice();
  // const gas = BigNumber.from("");
  console.log('单位gas费用：', gas.toString());
  const costFee = gas * 1.6 * 30000;
  console.log('总的gas费用：', costFee.toFixed(0));

  // const data = hexData(item, costFee);
  // const param = {
  //   data,
  //   from: store.getters.wallet.address,
  //   to: IERC20_ADDRESS,
  //   value: utils.parseEther((item.value * 1.02).toString())._hex
  // };
  // const res = await wallet.estimateGas(param);
  return costFee.toFixed(0);
  //  currentGas.value = utils.formatEther(BigNumber.from(gas));
};
const pay = async (item) => {
  window.open('https://www.ierc20.com/market/' + item.tick, '_blank');
  //
  // if (loading.value) return;
  // if (canBuy.value && balance.value >= totalPay.value) {
  //   const wallet = store.getters.wallet;
  //   loading.value = true;
  //
  //   const transaction = {
  //     type: 2,
  //     chainId: await wallet.getChainId(),
  //     to: IERC20_ADDRESS,
  //     maxPriorityFeePerGas: BigNumber.from('50000000'),
  //     nonce: await wallet.getTransactionCount(),
  //     value: utils.parseEther(totalPay.value.toString()),
  //     data: hexData(currentOrder.value, BigNumber.from(currentGas.value).div(30000).toString())
  //   };
  //    console.log("交易数据:",transaction);
  //   // const rawTransaction = utils.serializeTransaction(transaction);
  //   // const transactionHash = utils.keccak256(rawTransaction);
  //   // console.log(transactionHash)
  //   // const realTransaction = await wallet.sendTransaction(transaction);
  //   // await realTransaction.wait();
  //   // const tx = await wallet.provider.getTransactionReceipt(realTransaction.hash);
  //   // console.log(JSON.stringify(tx));
  //   // alert('购买成功');
  //   showPopover.value = false;
  //   loading.value = false;
  // }
};
const hexData = (item, gasPrice) => {
  const { creator, amt, value, sign, tick } = item;
  const nonce = Date.now().toString();
  const data = {
    p: 'ierc-20',
    op: 'freeze_sell',
    freeze: [
      {
        amt: amt,
        gasPrice: gasPrice.toString(),
        nonce: nonce,
        platform: IERC20_ADDRESS,
        seller: creator,
        sign: sign,
        tick: tick,
        value: value
      }
    ]
  };
  console.log('签名的交易data数据:', data);
  return encodeTransactionData('data:application/json,' + JSON.stringify(data));
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
          highline: false //checkHighLine(item.value / item.amt)
        }"
      >
        <td>{{ item.tick }}</td>
        <td>{{ item.amt }}</td>
        <td style="color: #8f78f7">
          ${{ formatPrice(item.value / item.amt, 4) }}
          <div>{{ bnUtils.toWei(item.value / item.amt, 9).toFixed(0) }} Gwei</div>
        </td>
        <td>{{ formatAddress(item.creator) }}</td>
        <td>
          <div style="color: #ae6605">
            <span style="color: #999; font-size: 12px">ETH:</span>
            {{ formatNumber(item.value, 4) }}
          </div>
          <div style="color: #8f78f7">
            <span style="color: #999; font-size: 12px">USD:</span>
            {{ formatPrice(item.value, 2) }}
          </div>
        </td>
        <td>
          <div class="flex">
            <!--            <div class="op" @click="gotoMarket(item)">查看</div>-->
            <div class="op" style="margin-left: 8px" @click="pay(item)">市场</div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <Popover v-model="showPopover" :title="'购买' + currentOrder.tick + '费用明细'">
    <div class="body">
      <div>
        <div class="row">
          <span class="label">总价：</span>
          <span class="value">
            {{ currentOrder.value }} ETH ≈ ${{ formatPrice(currentOrder.value, 4) }}
          </span>
        </div>

        <div class="row">
          <span class="label">ierc20服务费：<span style="color: #555">(2%)</span></span>
          <span class="value"
            >{{ formatNumber(currentOrder.value * 0.02, 4) }} ETH ≈ ${{
              formatPrice(currentOrder.value * 0.02, 4)
            }}</span
          >
        </div>

        <div class="row last">
          <span class="label">网络gas费：</span>
          <span class="value"
            >{{ formatNumber(utils.formatEther(currentGas), 4) }}ETH ≈ ${{
              formatPrice(utils.formatEther(currentGas), 4)
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
        <!--        <div class="row">-->
        <!--          <span class="label">您的余额：</span>-->
        <!--          <span class="value rest"-->
        <!--            >{{ formatNumber(balance, 4) }} ETH ≈ ${{ formatPrice(balance, 4) }}</span-->
        <!--          >-->
        <!--        </div>-->
      </div>
      <div class="flex warn">
        <img src="../../../../assets/icon-warning.svg" alt="" />
        <span>为了你的钱包交易安全，我们只做交易费用评估，不支持交易!</span>
      </div>
      <Button
        :disable="!canBuy"
        height="52px"
        background="#AE6605"
        style="margin-top: 30px"
        @click="pay(currentOrder)"
      >
        <span v-if="loading" class="flex">
          <img class="loading" src="../../../../assets/icon_loading.svg" />
          正在交易...
        </span>
        <span v-else>{{ !canBuy ? '已经卖出' : '去市场交易' }}</span>
      </Button>
    </div>
  </Popover>
</template>

<style scoped lang="less">
.warn {
  font-size: 12px;
  color: #ff5733;
  margin-top: 16px;
}
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
