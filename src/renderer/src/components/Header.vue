<script setup>
import { useRouter } from 'vue-router';
import icon_back from '../assets/icon-back.svg';
import icon_wallet from '../assets/icon-wallet.svg';
import icon_login_ok from '../assets/icon-login-ok.svg';
import { ref, computed } from 'vue';
import { ETHEREUM_RPC_MAIN } from '../views/Mint/Main/constant';
import Popover from './Popover.vue';
import Selector from './Selector.vue';
import Input from './Input.vue';
import Button from './Button.vue';
import { useStore } from 'vuex';
import { formatAddress } from '../util';
const store = useStore();
const router = useRouter();
const selectNetwork = ref(ETHEREUM_RPC_MAIN[0]);
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

const isLogin = computed(() => {
  return !!store.getters.wallet;
});
const address = computed(() => {
  return isLogin.value ? store.getters.wallet.address : '';
});
const back = () => {
  router.back();
};
const privateKey = ref('');
const popoverVisibility = ref(false);
const showPopover = () => {
  if (isLogin.value) {
    store.commit('logout');
    alert('退出成功');
  } else {
    popoverVisibility.value = true;
  }
};

const connectWallet = () => {
  store
    .dispatch('login', {
      url: selectNetwork.value.value,
      key: privateKey.value
    })
    .then(() => {
      popoverVisibility.value = false;
    })
    .catch(() => {
      alert('登录失败');
    });
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
    <img
      :title="isLogin ? '点击退出登录' : '点击绑定钱包'"
      :src="isLogin ? icon_login_ok : icon_wallet"
      alt=""
    />
    <div class="address">{{ formatAddress(address, 3, 3) }}</div>
  </div>
  <Popover v-model="popoverVisibility" title="使用密钥登录钱包">
    <div class="popover-container">
      <Selector
        height="42px"
        radius="8px"
        wrapper-height="54px"
        content-height="54px"
        :data="ETHEREUM_RPC_MAIN"
        width="100%"
        @change="(item) => (selectNetwork = item)"
      />
      <Input
        v-model="privateKey"
        class="inputer"
        height="42px"
        background="#404040"
        width="100%"
        font-size="16px"
        placeholder="请输入钱包私钥"
      />
      <Button
        :disable="!privateKey"
        height="48px"
        class="shadow"
        style="margin-top: 50px"
        @click="connectWallet()"
      >
        连接钱包
      </Button>
    </div>
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
  display: flex;
  flex-direction: column;
  align-items: end;
  &:hover {
    opacity: 0.5;
  }
  .address {
    color: #ccc;
    font-size: 12px;
  }
}
.back {
  left: 40px;
}
.wallet {
  right: 40px;
}
.popover-container {
  padding: 30px 40px;
}
.inputer {
  margin-top: 16px;
}
</style>
