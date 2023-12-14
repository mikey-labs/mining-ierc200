<script setup>
import { useRouter } from 'vue-router';
import icon_back from '../assets/icon-back.svg';
import icon_wallet from '../assets/icon-wallet.svg';
import {ref} from "vue";
import {PROVIDER_RPC_MAIN} from "../views/Mint/Main/constant";
import Popover from "./Popover.vue";

const router = useRouter();
const selectNetwork = ref(PROVIDER_RPC_MAIN[0]);
defineProps({
  title: {
    type: String
  },
  subTitle: {
    type: String
  },
  showBack: {
    type: Boolean,
    default: true
  }
});
const back = () => {
  router.back();
};
const popoverVisibility = ref(false);
const showPopover = () => {
  popoverVisibility.value = true;
};
</script>

<template>
  <div v-if="showBack" class="back" @click="back">
    <img :src="icon_back" alt="" />
  </div>
  <div class="header">
    <div>
      <div>{{ title }}</div>
      <div v-if="subTitle" class="tip">{{ subTitle }}</div>
    </div>
  </div>
  <div class="wallet" @click="showPopover()">
    <img :src="icon_wallet" alt="" />
  </div>
  <Popover v-model="popoverVisibility" >
1
  </Popover>
</template>

<style scoped lang="less">
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
    &:before {
      margin-right: 12px;
    }
    &:after {
      margin-left: 12px;
    }
  }
}
.back,
.wallet {
  z-index: 999;
  position: absolute;
  top: 40px;
  cursor: pointer;
  transition: opacity 0.3s;
  &:hover {
    opacity: 0.5;
  }
}
.back {
  left: 40px;
}
.wallet {
  right: 40px;
}
</style>
