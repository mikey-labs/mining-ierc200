<script setup>
import { useRouter } from 'vue-router';
import mint_icon from '../../assets/moudle/mint-icon.svg';
import market_icon from '../../assets/moudle/market-icon.svg';
const router = useRouter();
const modules = [
  {
    icon: mint_icon,
    name: 'IERC20 采矿',
    url: '/mint/main'
  },
  {
    icon: market_icon,
    name: '铭文市场',
    url: '/pow/main'
  },
];
const gotoModule = (item) => {
  router.push(item.url);
};
</script>

<template>
  <main>
    <div class="header">
      <div>
        <div>WEB3.0 工具集</div>
        <div class="tip">开启你的数字之旅</div>
      </div>
    </div>
    <div class="module-list">
      <div v-for="(item, i) in modules" :key="i" class="module" @click="gotoModule(item)">
        <img :src="item.icon" class="icon" />
        <div class="title">{{ item.name }}</div>
      </div>
    </div>
    <img src="../../assets/main-bg.png" class="bg" />
  </main>
</template>

<style scoped lang="less">
.flex {
  display: flex;
  align-items: center;
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
  .tip {
    position: relative;
    display: flex;
    align-items: center;
    font-weight: 300;
    color: #ccc;
    font-size: 16px;
    margin-top: 4px;
    &:before,
    &:after {
      content: '';
      height: 1px;
      background: #ccc;
      width: 40px;
    }
    &:before{
      margin-right: 12px;
    }
    &:after{
      margin-left: 12px;
    }
  }
}
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
    margin-right: 54px;
    &:hover {
      opacity: 0.5;
    }
    .icon {
      width: 80px;
      height: 80px;
      border-radius: 16px;
      -webkit-user-drag: none;
      object-fit: cover;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 1);
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
    background: url('../../assets/main-bg.png') no-repeat;
    background-size: cover;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 0;
    filter: blur(10px);
    background: rgba(0, 0, 0, 0.3);
  }
}
</style>
