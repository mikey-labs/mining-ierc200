<script setup>
import { computed, ref } from 'vue';
import icon_check from '../../assets/check.svg';
import icon_uncheck from '../../assets/uncheck.svg';
import icon_mining from '../../assets/icon_mining.svg';
import icon_back from '../../assets/icon-back.svg';
import { useRouter } from 'vue-router';
import { ethers } from 'ethers';

const router = useRouter();
const checkValue = ref('ierc-m5');

const checkBoxData = [
  {
    label: 'ierc-m5',
    value: 'ierc-m5'
  },
  {
    label: 'ierc-m4',
    value: 'ierc-m4'
  }
];
const loading = ref(false);
const key = localStorage.getItem('privateKey') || '';

const inputValue = ref(key);
const canSubmit = computed(() => !!inputValue.value);
const submit = () => {
  if (canSubmit.value) {
    try {
      const wallet = new ethers.Wallet(inputValue.value);
      localStorage.setItem('privateKey', inputValue.value);
      router.push({
        path: '/runner',
        query: {
          privateKey: inputValue.value,
          tick: checkValue.value,
          address: wallet.address
        }
      });
    } catch (e) {
      alert('您输入的密钥不正确');
    }
  }
};
const back = () => {
  localStorage.clear();
  router.back();
};
</script>

<template>
  <main>
    <div class="back" @click="back">
      <img :src="icon_back" alt="" />
    </div>
    <div class="header">
      <div>
        <div>IERC200 挖矿工具</div>
      </div>
    </div>
    <div class="form">
      <div class="label">配置数据</div>
      <div class="row shadow">
        <div
          v-for="(item, i) in checkBoxData"
          :key="i"
          class="radio-group"
          @click="checkValue = item.value"
        >
          <img :src="checkValue === item.value ? icon_check : icon_uncheck" alt="" />
          <span style="margin-left: 4px">{{ item.label }}</span>
        </div>
      </div>
      <input v-model="inputValue" class="row input shadow" placeholder="填写您钱包账户地址" />
      <button class="submit shadow" :class="{ disable: loading || !canSubmit }" @click="submit">
        <img :src="icon_mining" :class="{ loading }" alt="" />
        <span>开始挖矿</span>
      </button>
    </div>
  </main>
</template>

<style scoped lang="less">
.shadow {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}
.back {
  position: absolute;
  left: 40px;
  top: 40px;
  cursor: pointer;
}
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.loading {
  animation: linear 1s infinite rotate;
}
.header {
  padding-top: 75px;
  display: flex;
  font-size: 32px;
  flex-direction: column;
  font-weight: 500;
  color: white;
  align-items: center;
}
.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 37px;
  .label {
    color: #ccc;
    font-size: 16px;
    margin-bottom: 12px;
  }
  .row {
    background: #303030;
    border-radius: 8px;
    display: flex;
    padding: 0 20px;
    align-items: center;
    height: 60px;
    margin-bottom: 24px;
  }
  .radio-group {
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-right: 93px;
  }
  .input {
    padding: 0 20px;
    outline: none;
    border: none;
    font-size: 18px;
    background: #303030;
    color: white;
    height: 60px;
    border-radius: 8px;
    width: 390px;
  }
  .submit {
    &:hover {
      background: #2064af;
    }
    transition: all 0.5s;
    cursor: pointer;
    height: 60px;
    border-radius: 8px;
    border: none;
    color: white;
    margin-top: 10px;
    -webkit-appearance: none;
    background: #2a82e4;
    font-size: 18px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    &.disable,
    &.disable:hover {
      background: #808080;
      cursor: default;
    }
  }
}
</style>
