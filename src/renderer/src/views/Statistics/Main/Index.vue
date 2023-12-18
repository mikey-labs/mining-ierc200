<script setup>
import Header from '../../../components/Header.vue';
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { getErsVolumeInfo, getEthereumToUSD, getStatisticsByTick } from '../../../api/pow';
import { utils } from 'ethers';
import { formatNumber } from '../../../util';
import Block from './components/Block.vue';
const audio = new Audio('/329.wav');
const listInfo = reactive([]);

const getIercTokenInfo = () => {
  return getStatisticsByTick({
    limit: 11,
    offset: 0
  }).then(({ data }) => {
    for (const item of data.list) {
      const { tick, floor_price, volume_total } = item;
      const info = {
        url: 'https://www.ierc20.com/market/' + tick,
        tick,
        volume: formatNumber(utils.formatEther(volume_total), 4),
        totalSupply: '21,000,000',
        floorPrice: formatNumber(
          utils.formatEther(Number(floor_price).toFixed(0)) * unitPrice.value,
          6
        )
      };
      listInfo.push(info);
      checkAudio(info);
    }
  });
};
const checkAudio = (info) => {
  if (
    (info.tick === 'ers' && info.floorPrice <= 0.1) ||
    (info.tick === 'ierc-m4' && info.floorPrice <= 0.1) ||
    (info.tick === 'ethi' && info.floorPrice <= 2.2) ||
    (info.tick === 'ierc-m5' && info.floorPrice <= 0.006)
  ) {
    audio.play();
  }
};
const getErsTokenInfo = () => {
  getErsVolumeInfo().then(({ total }) => {
    const info = {
      url: 'https://ethrunes.xyz/orders/ers',
      tick: 'ers',
      volume: formatNumber(total['0xca2b148c42190d936f4329ff5e771675d8da4326'], 4),
      totalSupply: '30,000,000',
      floorPrice: formatNumber(
        (total['0x07e8981efcb7b46edbb89c265632031f328d3d51'] * 10) / unitPrice.value,
        6
      )
    };
    listInfo.push(info);
    checkAudio(info);
  });
};
const unitPrice = ref('0');
const getEthereumUnitPrice = () => {
  return getEthereumToUSD().then((data) => {
    unitPrice.value = +data.data;
  });
};
let timer = 0;
const loading = ref(false);
const refresh = async () => {
  loading.value = true;
  clearTimeout(timer);
  await getErsTokenInfo();
  await getIercTokenInfo();
  timer = setTimeout(() => {
    refresh();
  }, 15000);
  loading.value = false;
};

onMounted(async () => {
  await getEthereumUnitPrice();
  await refresh();
  getErsTokenInfo();
});

onUnmounted(() => {
  clearTimeout(timer);
});
</script>
<template>
  <main>
    <Header title="市场看板">
      <template #right>
        <div class="refresh" @click="refresh">
          <img
            :class="{ animation: loading }"
            src="../../../assets/icon-refresh.svg"
            alt="刷新"
            title="刷新"
          />
        </div>
      </template>
    </Header>
    <div class="container">
      <template v-for="(item, i) in listInfo" :key="i">
        <Block :data="item" />
      </template>
    </div>
  </main>
</template>

<style scoped lang="less">
main {
  padding: 15px 30px;
}

.container {
  padding-bottom: 50px;
  display: flex;
  flex-wrap: wrap;
  align-items: start;
}
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
  .animation {
    animation: rotate 1s ease-out infinite;
    animation-fill-mode: both;
  }
}
</style>
