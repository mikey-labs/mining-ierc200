<script setup>
import Header from '../../../components/Header.vue';
import { onMounted, ref } from 'vue';
import { get_api_v5_market_trades } from '../../../util/okax';
import Input from '../../../components/Input.vue';
import Button from '../../../components/Button.vue';

const ethPrice = ref(0);
const storeEthPrice = ref('');
let unitPriceTimer;
const intervalCheckEthPrice = async () => {
  clearTimeout(unitPriceTimer);
  await get_api_v5_market_trades({
    instId: 'ETH-USDT',
    limit: 1
  }).then((res) => {
    ethPrice.value = +res.data[0].px;
  });
  unitPriceTimer = setTimeout(() => {
    intervalCheckEthPrice();
  }, 5000);
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
};
const addNotify = (info) => {
  const { title, data, body } = info;
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      navigator.serviceWorker.ready.then(function (registration) {
        registration.showNotification(title, {
          icon: 'icon.png',
          vibrate: [200, 100, 200],
          silent: false,
          data: data,
          body: body
        });
      });
    }
  });
};
const saveEthPrice = () => {
  localStorage.setItem('storeEthPrice', storeEthPrice.value);
};
onMounted(async () => {
  await intervalCheckEthPrice();
  storeEthPrice.value = localStorage.getItem('storeEthPrice') || '';
});
</script>
<template>
  <main>
    <Header title="ETH价格" />
    <div class="container" style="text-align: center">
      <div style="margin-bottom: 100px; font-size: 30px; font-weight: bold; color: #ff4040">
        {{ ethPrice}} <span style="font-size: 16px; font-weight: normal">USDT</span>
      </div>
      <div class="flex" style="width: 300px">
        <Input v-model="storeEthPrice" height="40px" placeholder="eth报警价格" />
        <Button width="100px" height="40px" @click="saveEthPrice()">保存</Button>
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
