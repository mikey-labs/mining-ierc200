<script setup>
import Header from '../../../components/Header.vue';
import { onMounted, ref } from 'vue';
import Input from '../../../components/Input.vue';
import Button from '../../../components/Button.vue';
import { addNotify } from '../../../util';
import { getMarketTrades, getTakerVolume } from '../../../api/okx';

const ethPrice = ref(0);
const storeEthPrice = ref('');
const storeMinEthPrice = ref('');
let unitPriceTimer;
const intervalCheckEthPrice = async () => {
  clearTimeout(unitPriceTimer);
  await getMarketTrades({
    instId: 'ETH-USDT',
    limit: 1
  })
    .then((res) => {
      if (res && res.data) ethPrice.value = +res.data[0].px;
    })
    .catch(() => {});
  // await getPendingOrders();

  unitPriceTimer = setTimeout(() => {
    intervalCheckEthPrice();
  }, 10000);
  checkEthPrice();
};
const checkEthPrice = () => {
  if (Number(storeEthPrice.value) && ethPrice.value > Number(storeEthPrice.value)) {
    addNotify({
      title: 'eth涨幅达到阈值',
      data: '',
      body: `价格为${ethPrice.value}`
    });
  }
  if (Number(storeMinEthPrice.value) && ethPrice.value < Number(storeMinEthPrice.value)) {
    addNotify({
      title: 'eth跌幅达到阈值',
      data: '',
      body: `价格为${ethPrice.value}`
    });
  }
};

const saveEthPrice = () => {
  localStorage.setItem('storeEthPrice', storeEthPrice.value);
};
const saveMinEthPrice = () => {
  localStorage.setItem('storeMinEthPrice', storeMinEthPrice.value);
};
let currentVolume = ref(0);
let currentDate = ref('');
const getPendingOrders = async () => {
  getTakerVolume({
    instType: 'SPOT',
    ccy: 'ETH',
    // begin:Date.now().toString(),
    // end:(Date.now() - 1000 * 60 * 10).toString()
  })
    .then((data) => {
      const list = data.data;
      let sellTotal = 0,
        buyTotal = 0;
      // eslint-disable-next-line no-unused-vars
      list.map(([_, sell, buy]) => {
        sellTotal += +sell;
        buyTotal += +buy;
      });
      currentDate.value = new Date(+list[0][0]).toLocaleString();
      currentVolume.value = buyTotal - sellTotal;
    })
    .catch(() => {});
};
onMounted(async () => {
  await intervalCheckEthPrice();
  storeEthPrice.value = localStorage.getItem('storeEthPrice') || '';
  storeMinEthPrice.value = localStorage.getItem('storeMinEthPrice') || '';
});
</script>
<template>
  <main>
    <Header title="ETH价格" />
    <div class="container" style="text-align: center">
      <div style="margin-bottom: 100px; font-size: 84px; font-weight: bold; color: #ff4040">
        <span>{{ ethPrice.toFixed(2) }}</span>
        <span style="font-size: 32px; font-weight: normal">USDT</span>
      </div>
      <div class="flex" style="width: 400px; margin-bottom: 20px">
        <Input v-model="storeEthPrice" placeholder="eth涨幅报警价格" />
        <Button width="140px" height="60px" style="margin-left: 20px" @click="saveEthPrice()"
          >保存</Button
        >
      </div>
      <div class="flex" style="width: 400px">
        <Input v-model="storeMinEthPrice" placeholder="eth跌幅报警价格" />
        <Button width="140px" height="60px" style="margin-left: 20px" @click="saveMinEthPrice()"
          >保存</Button
        >
      </div>
    </div>
  </main>
</template>

<style scoped lang="less">
main {
  padding: 15px 10px;
}
.container {
  margin-top: 0;
  padding-bottom: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
