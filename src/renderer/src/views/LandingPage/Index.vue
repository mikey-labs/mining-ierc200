<script setup>
import { useRouter } from 'vue-router';
import mint_icon from '../../assets/moudle/mint-icon.svg';
import market_icon from '../../assets/moudle/market-icon.svg';
import tools_icon from '../../assets/moudle/tools-icon.svg';
import ers_icon from '../../assets/moudle/ers-icon.svg';
import ethereum_icon from '../../assets/moudle/ethereum-icon.svg';
import notify_icon from '../../assets/moudle/notify-icon.svg';
import statistics_icon from '../../assets/moudle/statistics-icon.svg';
import Header from '../../components/Header.vue';
const router = useRouter();
const modules = [
  {
    icon: ethereum_icon,
    name: 'Eth行情',
    url: '/eth/main'
  }, {
    icon: notify_icon,
    name: '短线提醒',
    url: '/pow/monitor'
  },
  {
    icon: market_icon,
    name: '铭文市场',
    url: '/pow/main'
  },
  {
    icon: statistics_icon,
    name: '市场看板',
    url: '/statistics/main'
  },
  // {
  //   icon: ers_icon,
  //   name: 'ers市场',
  //   url: '/ers/main'
  // },
  {
    icon: mint_icon,
    name: 'IERC20 采矿',
    url: '/mint/main'
  },
  {
    icon: tools_icon,
    name: '常用工具',
    url: '/tools/main'
  }
];
const gotoModule = (item) => {
  router.push(item.url);
};
</script>

<template>
  <main>
    <Header :show-back="false" title="WEB3.0 工具集" sub-title="开启你的数字之旅" />
    <div class="module-list">
      <div v-for="(item, i) in modules" :key="i" class="module" @click="gotoModule(item)">
        <img :src="item.icon" class="icon" />
        <div class="title">{{ item.name }}</div>
      </div>
    </div>
  </main>
</template>

<style scoped lang="less">
.module-list {
  padding: 0 90px;
  position: relative;
  z-index: 1;
  margin-top: 50px;
  display: flex;
  flex-wrap: wrap;
  .module {
    cursor: pointer;
    transition: all 0.5s;
    margin-right: 57px;
    margin-bottom: 30px;
    &:hover {
      opacity: 0.5;
    }
    .icon {
      width: 80px;
      height: 80px;
      border-radius: 16px;
      -webkit-user-drag: none;
      object-fit: cover;
    }
    .title {
      text-align: center;
      margin-top: 4px;
      font-size: 16px;
      font-weight: normal;
      color: white;
    }
  }
}
main {
  position: relative;
  .bg {
    content: '';
    position: absolute;
    background-size: cover;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 0;
    filter: blur(30px);
  }
}
</style>
