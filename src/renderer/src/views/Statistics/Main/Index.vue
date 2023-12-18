<script setup>
import Header from '../../../components/Header.vue';
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import {getErsVolumeInfo, getEthereumToUSD, getStatisticsByTick} from '../../../api/pow';
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
    console.log(data);
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
      if (
        (tick === 'ierc-m4' && info.floorPrice <= 0.1) ||
        (tick === 'ethi' && info.floorPrice <= 2.2) ||
        (tick === 'ierc-m5' && info.floorPrice <= 0.006)
      ) {
        audio.play();
      }
    }
  });
};
const getErsTokenInfo = () => {
  getErsVolumeInfo().then((res)=>{
    console.log(res)
  })
}
const unitPrice = ref('0');
const getEthereumUnitPrice = () => {
  return getEthereumToUSD().then((data) => {
    unitPrice.value = +data.data;
  });
};
let timer = 0;
const refresh = async () => {
  clearTimeout(timer);
  await getIercTokenInfo();
  timer = setTimeout(() => {
    // refresh();
  }, 15000);
};

onMounted(async () => {
  await getEthereumUnitPrice();
  await refresh();
  getErsTokenInfo()
});

onUnmounted(() => {
  clearTimeout(timer);
});
</script>
<template>
  <main>
    <Header title="市场看板" />
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
</style>
