<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Header from '../../../components/Header.vue';
import {getEthereumToUSD, getIERC20OrderList, getStatisticsByTick} from '../../../api/pow';
import Table from '../Main/components/Table.vue';
import icon_refresh from '../../../assets/icon-refresh.svg';
import icon_notification from '../../../assets/icon-notification.svg';
import { formatNumber } from '../../../util';
import Toast from '../../../components/Toast.vue';
import Input from '../../../components/Input.vue';
import Button from '../../../components/Button.vue';
import { get_api_v5_market_trades } from '../../../util/okax';

const unitPrice = ref(0);
const ticks = ['ensc', 'ierc-m4', 'ierc', 'ethpi'];
const tableData = ref([]);
const getOrderInfo = () => {
  const promiseAll = [];
  ticks.map((tick) => {
    promiseAll.push(
      getIERC20OrderList({
        limit: 2,
        minValue: '0.00005',
        offset: 0,
        status: 'list',
        tick: tick
      }).then((res) => {
        checkOrder(res.data.orders);
        return res.data.orders;
      })
    );
  });
  return Promise.all(promiseAll).then((orders) => {
    tableData.value = orders.flat();
  });
};
const getEthereumUnitPrice = () => {
  // return get_api_v5_market_trades({
  //   instId: 'ETH-USDT',
  //   limit: 1
  // }).then((res) => {
  //   unitPrice.value = +res.data[0].px;
  // });
  return getEthereumToUSD().then((data) => {
    unitPrice.value = +data.data;
  });
};
const loading = ref(false);
const checkEthPrice = () => {
  if (Number(ethPrice.value) && unitPrice.value > Number(ethPrice.value)) {
    addNotify({
      title: 'eth涨幅达到阈值',
      data: '',
      body: `价格为${unitPrice.value}`
    });
  }
};
let timer, unitPriceTimer;

const refresh = async () => {
  loading.value = true;
  clearTimeout(timer);

  await getOrderInfo();
  timer = setTimeout(() => {
    refresh();
  }, 15000);
  loading.value = false;
};
const TICKS = 'TICKS';
const NEW_TICK = 'NEW_TICK';
const newTickData = ref(null);
const showToast = ref(false);
const tickNumber = ref(0);
const checkNewTick = () => {
  const newTick = localStorage.getItem(NEW_TICK);
  if (newTick) {
    newTickData.value = JSON.parse(newTick);
    showToast.value = true;
  }
  getStatisticsByTick({
    limit: 10000,
    offset: 0
  }).then((res) => {
    const {
      data: { list },
      code
    } = res;
    const storeTicks = localStorage.getItem(TICKS);
    if (code === 1) {
      tickNumber.value = list.length;
      localStorage.setItem(TICKS, JSON.stringify(list));
      if (storeTicks) {
        const storeTicksList = JSON.parse(storeTicks);
        if (storeTicksList.length === list.length) return;
        list.map((inscription) => {
          const find = storeTicksList.find((item) => item.tick === inscription.tick);
          if (!find) {
            addNotify({
              title: '新的铭文：' + inscription.tick,
              data: 'https://www.ierc20.com/market/' + inscription.tick,
              body: `创建时间：${new Date().toLocaleString()}`
            });
            storeNewTickAndToastIt({
              tick: inscription.tick,
              url: 'https://www.ierc20.com/market/' + inscription.tick
            });
            showToast.value = true;
          }
        });
      }
    }
    console.log(res.data);
  });
};
const storeNewTickAndToastIt = (data) => {
  const { tick, url } = data;
  newTickData.value = {
    tick: tick,
    createTime: new Date().toLocaleString(),
    url: url
  };
  localStorage.setItem(NEW_TICK, JSON.stringify(newTickData.value));
  showToast.value = true;
};
const closeToast = () => {
  localStorage.removeItem(NEW_TICK);
  showToast.value = false;
};
const ethPrice = ref('0');
const getStoreEthPrice = () => {
  ethPrice.value = localStorage.getItem('storeEthPrice') || '';
};
const intervalCheckEthPrice = async () => {
  clearTimeout(unitPriceTimer);
  await getEthereumUnitPrice();
  unitPriceTimer = setTimeout(() => {
    intervalCheckEthPrice();
  }, 5000);
  checkEthPrice();
}
onMounted(async () => {

  intervalCheckEthPrice();
  await refresh();
  // checkNewTick();
  getStoreEthPrice();
});
onUnmounted(() => {
  clearTimeout(unitPriceTimer);
  clearTimeout(timer);
});
const checkOrder = (orders) => {
  const [firstOrder, secondOrder] = orders;
  const unitPrice1 = firstOrder.value / firstOrder.amt;
  const unitPrice2 = secondOrder.value / secondOrder.amt;
  if ((unitPrice2 - unitPrice1) / unitPrice2 >= 0.2) {
    notifyMe(firstOrder);
  }
};
function notifyMe(order) {
  // 首先讓我們確定瀏覽器支援 Notification
  if (!('Notification' in window)) {
    return;
  }
  addNotify({
    title: `${order.tick} 新订单！`,
    data: 'https://www.ierc20.com/market/' + order.tick,
    body: `数量：${order.amt}，单价：$${formatPrice(
      order.amt / order.value,
      4
    )}，总价：$${formatPrice(order.value, 2)}`
  });

  // 如果使用者還是不同意授權執行 Notification
  // 最好還是進行適當的處理以避免繼續打擾使用者
}
const formatPrice = (value, dem = 6) => {
  return formatNumber(value * unitPrice.value, dem);
};
const saveEthPrice = () => {
  localStorage.setItem('storeEthPrice', ethPrice.value);
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
</script>

<template>
  <main>
    <Header title="短线提醒">
      <template #right>
        <div>
          <img
            :class="{ animation: loading }"
            class="refresh"
            :src="icon_refresh"
            alt=""
            @click="refresh"
          />
        </div>
      </template>
    </Header>
    <div class="container">
      <div class="flex">
        <div style="flex: 1; color: #ff5733; font-size: 15px">
          <span style="font-weight: bold; font-size: 18px">1</span>
          ETH =
          <span style="font-weight: bold; font-size: 18px">{{ unitPrice.toFixed(2) }}</span> USD
          <!--          <span style="padding-left: 30px;">铭文总数：{{ tickNumber }}</span>-->
        </div>
        <div class="flex" style="width: 300px; margin-right: 200px">
          <Input v-model="ethPrice" height="40px" placeholder="eth报警价格" />
          <Button width="100px" height="40px" @click="saveEthPrice()">保存</Button>
        </div>
        <div
          class="flex notify"
          @click="addNotify({ title: '测试通知', body: '测试内容', data: '测试data' })"
        >
          <img :src="icon_notification" alt="" />
        </div>
      </div>
      <Table :data="tableData" :unit-price="unitPrice" />
      <Toast v-if="showToast" :title="'新铭文' + newTickData.tick" @close="closeToast">
        创建时间：{{ newTickData.createTime }}
        <a target="_blank" :href="newTickData.url">跳转市场</a>
      </Toast>
    </div>
  </main>
</template>

<style scoped lang="less">
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.notify {
  margin-bottom: 16px;
  cursor: pointer;
  justify-content: right;
}
.refresh {
  cursor: pointer;
  margin-left: 8px;
  transition: opacity 0.5s;
  &:hover {
    opacity: 0.7;
  }
}
.animation {
  animation: rotate 1s ease-out infinite;
  animation-fill-mode: both;
}
</style>
