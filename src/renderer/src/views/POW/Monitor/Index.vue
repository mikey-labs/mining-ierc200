<script setup>
import { ref, onMounted } from 'vue';
import Header from '../../../components/Header.vue';
import { getEthereumToUSD, getIERC20OrderList } from '../../../api/pow';
import Table from '../Main/components/Table.vue';
import icon_refresh from '../../../assets/icon-refresh.svg';
import { formatNumber } from '../../../util';
import Button from '../../../components/Button.vue';

const unitPrice = ref(0);
const ticks = ['ethi', 'ierc-m4', 'ierc', 'Serj', 'Sparkle Inscription'];
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
  await getOrderInfo();
  timer = setTimeout(() => {
    refresh();
  }, 15000);
  loading.value = false;
};
onMounted(async () => {
  await getEthereumUnitPrice();
  await refresh();
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

  // 再檢查使用者是否已經授權執行 Notification
  else if (Notification.permission === 'granted') {
    // 如果已經授權就可以直接新增 Notification 了!
    addNotify(order);
  }

  // 否則，我們會需要詢問使用者是否開放權限
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        addNotify(order);
      }
    });
  }

  // 如果使用者還是不同意授權執行 Notification
  // 最好還是進行適當的處理以避免繼續打擾使用者
}
const formatPrice = (value, dem = 6) => {
  return formatNumber(value * unitPrice.value, dem);
};
const addNotify = (order) => {
  const notification = new Notification(`${order.tick} 新订单！`, {
    vibrate: [200, 100, 200],
    body: `数量：${order.amt}，总价：$${formatPrice(order.value, 2)}`
  });
  notification.addEventListener('click', () => {
    window.open('https://www.ierc20.com/market/' + order.tick, '_blank');
  });
};
</script>

<template>
  <main>
    <Header title="短线提醒">
      <template #right>
        <img
          :class="{ animation: loading }"
          class="refresh"
          :src="icon_refresh"
          alt=""
          @click="refresh"
        />
      </template>
    </Header>
    <div class="container">
      <Table :data="tableData" :unit-price="unitPrice" />
      <Button width="200px" @click="addNotify({ tick: 'ierc', amt: '400', value: '888' })">通知测试</Button>
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
