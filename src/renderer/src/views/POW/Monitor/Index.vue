<script setup>
import { ref, onMounted } from 'vue';
import Header from '../../../components/Header.vue';
import { getEthereumToUSD, getIERC20OrderList } from '../../../api/pow';
import Table from '../Main/components/Table.vue';
import icon_refresh from '../../../assets/icon-refresh.svg';
import icon_notification from '../../../assets/icon-notification.svg';
import { formatNumber } from '../../../util';

const unitPrice = ref(0);
const ticks = ['ethpi','ethi', 'ierc-m4', 'ierc', 'Sparkle Inscription'];
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
  return getEthereumToUSD().then((data) => {
    unitPrice.value = +data.data;
  });
};
let timer;
const loading = ref(false);
const refresh = async () => {
  loading.value = true;
  clearTimeout(timer);
  await getEthereumUnitPrice();
  await getOrderInfo();
  timer = setTimeout(() => {
    refresh();
  }, 5000);
  loading.value = false;
};
onMounted(async () => {
  navigator.serviceWorker.register('sw.js');
  await refresh();
});
const audio = new Audio('/329.wav');
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
  addNotify(order);

  // 如果使用者還是不同意授權執行 Notification
  // 最好還是進行適當的處理以避免繼續打擾使用者
}
const formatPrice = (value, dem = 6) => {
  return formatNumber(value * unitPrice.value, dem);
};
const addNotify = (order) => {
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      navigator.serviceWorker.ready.then(function (registration) {
        registration.showNotification(`${order.tick} 新订单！`, {
          icon: 'icon.png',
          vibrate: [200, 100, 200],
          silent: false,
          data: 'https://www.ierc20.com/market/' + order.tick,
          body: `数量：${order.amt}，总价：$${formatPrice(order.value, 2)}`
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
        <div style="flex: 1;color: #ff5733;font-size: 15px ">
          <span style="font-weight: bold;font-size: 18px">1</span>
          ETH = <span style="font-weight: bold;font-size: 18px">{{ unitPrice }}</span> USD
        </div>
        <div class="flex notify" @click="addNotify({ tick: 'ierc', amt: '400', value: '8' })">
          <img :src="icon_notification" alt="" />
        </div>
      </div>
      <Table :data="tableData" :unit-price="unitPrice" />
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
