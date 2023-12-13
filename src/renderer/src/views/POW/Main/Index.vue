<script setup>
import { onMounted, onUnmounted, computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import icon_back from '../../../assets/icon-back.svg';
import axios from 'axios';
import { utils, BigNumber } from 'ethers';
const router = useRouter();

const checkBoxData = [
  {
    label: 'ierc-m4',
    value: 'ierc-m4'
  },
  {
    label: 'ierc-m5',
    value: 'ierc-m5'
  }
];
const fetch = axios.create({
  baseURL: 'https://service.ierc20.com/api/v1/'
});
let unitPrice = ref(1);
const listInfo = ref({
  tick: '',
  workc: '',
  protocol: '',
  volume_day: '',
  volume_total: '',
  floor_price: '',
  add_ratio: ''
});
const floorPrice = computed(() => {
  const wei = BigNumber.from(Number.parseInt(+listInfo.value.floor_price));
  const eth = utils.formatEther(wei);
  return eth * unitPrice.value;
});
const showDropDownList = ref(false);
const selectValue = ref(checkBoxData[0]);
const tableData = ref([]);
const selectorChange = (item) => {
  selectValue.value = item;
  showDropDownList.value = !showDropDownList.value;
};
const back = () => {
  router.back();
};
const getTXData = () => {
  return fetch
    .post('order/list', {
      limit: 10,
      minValue: '0.00005',
      offset: 0,
      status: 'list',
      tick: selectValue.value.value
    })
    .then(({ data }) => {
      const list = data.data.orders;
      if (data.code === 1) {
        tableData.value = list;
      }
    });
};
const formatAddress = (str) => {
  return str.substring(0, 6) + '...' + str.substring(str.length - 4, str.length);
};
const formatPrice = (value) => {
  return formatNumber(value * unitPrice.value, 8);
};
const getEthereumUnitPrice = () => {
  return fetch
    .get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
    .then((res) => {
      unitPrice.value = res.data.ethereum.usd;
    });
};
const getCurrentListInfo = () => {
  fetch
    .post('ticks/list', {
      tick: selectValue.value.value
    })
    .then(({ data }) => {
      listInfo.value = data.data.list[0];
    });
};
let timer = 0;
const refresh = async () => {
  clearTimeout(timer);
  await getCurrentListInfo();
  await getTXData();
  timer = setTimeout(() => {
    refresh();
  }, 10000);
};
onMounted(async () => {
  await getEthereumUnitPrice();
  await refresh();
});
const formatNumber = (value, dem) => {
  return Number(Number(value).toFixed(dem));
};
const checkHighline = (unitPrice) => {
  const wei = BigNumber.from(Number.parseInt(+listInfo.value.floor_price));
  console.log(unitPrice,utils.formatEther(wei), unitPrice / utils.formatEther(wei));
  return  unitPrice / utils.formatEther(wei) <= 0.3;
};
const gotoMarket = (item) => {
  window.open('https://www.ierc20.com/market/ierc-m4', '_blank');
};
onUnmounted(() => {
  clearTimeout(timer);
});
</script>

<template>
  <main>
    <div class="back" @click="back">
      <img :src="icon_back" alt="" />
    </div>
    <div class="header">
      <div>
        <div>铭文市场</div>
      </div>
    </div>
    <div class="query-form">
      <div class="flex">
        <div>挂单数据-实时</div>
        <div class="refresh" @click="refresh">
          <img src="../../../assets/icon-refresh.svg" alt="刷新" title="刷新" />
        </div>
      </div>
      <div class="flex list-info">
        <div>地板价：${{ floorPrice }}</div>
      </div>
      <div class="selector-wrapper">
        <div class="selector" @click="showDropDownList = !showDropDownList">
          {{ selectValue.label }}
          <img src="../../../assets/arrow.svg" alt="" />
        </div>
        <transition duration="500" name="slideIn">
          <div v-show="showDropDownList" class="list">
            <div
              v-for="(item, i) in checkBoxData"
              :key="i"
              class="item"
              @click="selectorChange(item)"
            >
              <div>
                {{ item.label }}
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <div class="table-wrapper">
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
            v-for="(item, i) in tableData"
            :key="i"
            :class="{
              highline: checkHighline(item.value / item.amt)
            }"
          >
            <td>{{ item.tick }}</td>
            <td>{{ item.amt }}</td>
            <td style="color: #8f78f7;">${{ formatPrice(item.value / item.amt) }}</td>
            <td>{{ formatAddress(item.creator) }}</td>
            <td>
              <div style="color: #ae6605">
                <span style="color: #999;font-size: 12px;">ETH:</span>
                {{ formatNumber(item.value, 6) }}
              </div>
              <div style="color: #8f78f7; ">
                <span style="color: #999;font-size: 12px;">USD:</span>
                {{ formatPrice(item.value) }}
              </div>
            </td>
            <td>
              <div class="op" @click="gotoMarket(item)">去交易</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<style scoped lang="less">
.list-info {
  flex: 1;
  justify-content: center;
}
.refresh {
  cursor: pointer;
  margin-left: 8px;
  transition: opacity 0.5s;
  &:hover {
    opacity: 0.7;
  }
}
@keyframes flashing {
  from{
    background: red;
  }
  to{
    background: #303030;
  }
}
.table-wrapper {
  margin-top: 24px;
  height: 460px;
  overflow: auto;
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
    animation: flashing .2s infinite;
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
main {
  width: 750px;
}
.back {
  z-index: 999;
  position: absolute;
  left: 40px;
  top: 40px;
  cursor: pointer;
}
.flex {
  display: flex;
  align-items: center;
}
.query-form {
  margin-top: 30px;
  color: #ccc;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.selector-wrapper {
  position: relative;
  .selector {
    cursor: pointer;
    width: 140px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 16px;
    background: #404040;
    border-radius: 40px;
    color: #ccc;
    font-size: 16px;
    &:hover {
      background: #454545;
    }
  }
  .list {
    position: absolute;
    top: 40px;
    left: 0;
    width: 140px;
    background: #404040;
    border-radius: 8px;
    max-height: 104px;
    overflow: auto;
    .item {
      &:hover {
        background: #454545;
      }
      cursor: pointer;
      font-size: 16px;
      color: #999;
      padding: 16px;
      border-bottom: 1px solid #555;
    }
  }
}
.shadow {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.header {
  z-index: 1;
  position: relative;
  padding-top: 30px;
  display: flex;
  font-size: 32px;
  flex-direction: column;
  font-weight: 500;
  color: white;
  align-items: center;
}
.slideIn-enter-from,
.slideIn-leave-to {
  height: 0;
}
// 元素进入结束的状态 ｜ 元素开始离开的状态。 这里不写也可以！！！！！！
.slideIn-enter-to,
.slideIn-leave-from {
  height: 220px;
}
// 元素进入 ｜ 结束时，过渡的效果
.slideIn-enter-active,
.slideIn-leave-active {
  // 过渡动画的使用
  transition: height 0.5s;
}
</style>
