<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { BigNumber, utils } from 'ethers';
import { getEthereumToUSD, getIERC20OrderList, getStatisticsByTick } from '../../../api/pow';
import Table from './components/Table.vue';
import Selector from '../../../components/Selector.vue';
import { formatNumber } from '../../../util';
import Header from '../../../components/Header.vue';


const loading = ref(false);
const checkBoxData = [
  {
    label: 'ierc-m4',
    value: 'ierc-m4'
  },
  {
    label: 'ierc-m5',
    value: 'ierc-m5'
  },
  {
    label: 'ethi',
    value: 'ethi'
  }
];

let unitPrice = ref(1);
const listInfo = ref({
  tick: '',
  workc: '',
  protocol: '',
  volume_day: '',
  volume_total: '',
  floor_price: 0,
  add_ratio: ''
});
const floorPrice = computed(() => {
  const wei = BigNumber.from(listInfo.value.floor_price);
  const eth = utils.formatEther(wei);
  return formatNumber(eth * unitPrice.value, 6);
});
const selectValue = ref(checkBoxData[0]);
const tableData = ref([]);
const selectorChange = (item) => {
  selectValue.value = item;
  tableData.value = [];
  refresh();
};
const getTXData = () => {
  return getIERC20OrderList({
    limit: 10,
    minValue: '0.00005',
    offset: 0,
    status: 'list',
    tick: selectValue.value.value
  }).then((data) => {
    const list = data.data.orders;
    if (data.code === 1) {
      tableData.value = list;
    }
  });
};
const getEthereumUnitPrice = () => {
  return getEthereumToUSD().then((data) => {
    unitPrice.value = data.ethereum.usd;
  });
};
const getCurrentListInfo = () => {
  return getStatisticsByTick({
    tick: selectValue.value.value
  }).then(({ data }) => {
    data.list[0].floor_price = Number((data.list[0].floor_price * 1).toFixed(0));
    listInfo.value = data.list[0];
  });
};
let timer = 0;
const refresh = async () => {
  loading.value = true;
  clearTimeout(timer);
  await getCurrentListInfo();
  await getTXData();
  timer = setTimeout(() => {
    refresh();
  }, 10000);
  loading.value = false;
};

onMounted(async () => {
  await getEthereumUnitPrice();
  await refresh();
});

onUnmounted(() => {
  clearTimeout(timer);
});
</script>

<template>
  <main>
    <Header title="铭文市场" />
    <div class="query-form">
      <div class="flex">
        <div>挂单数据-实时</div>
        <div class="refresh" @click="refresh">
          <img
            :class="{ animation: loading }"
            src="../../../assets/icon-refresh.svg"
            alt="刷新"
            title="刷新"
          />
        </div>
      </div>
      <div class="flex list-info">
        <div>地板价：${{ floorPrice }}</div>
      </div>
      <div style="width: 140px">
        <Selector :width="140" :data="checkBoxData" @change="selectorChange" />
      </div>
    </div>
    <div class="table-wrapper">
      <Table :data="tableData" :unit-price="unitPrice" :floor-price="listInfo.floor_price" />
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
.list-info {
  flex: 1;
  justify-content: center;
  color: white;
}
.refresh {
  cursor: pointer;
  margin-left: 8px;
  transition: opacity 0.5s;
  &:hover {
    opacity: 0.7;
  }
  .animation {
    animation: rotate 1s ease-out infinite;
    animation-fill-mode: both;
  }
}
@keyframes flashing {
  from {
    background: red;
  }
  to {
    background: #303030;
  }
}
.table-wrapper {
  margin-top: 24px;
  height: 480px;
  overflow: auto;
}

main {
  width: 750px;
}

.query-form {
  margin-top: 30px;
  color: #ccc;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
