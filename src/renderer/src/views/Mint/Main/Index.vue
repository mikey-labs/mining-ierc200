<script setup>
import { computed, ref } from 'vue';
import icon_check from '../../../assets/check.svg';
import icon_uncheck from '../../../assets/uncheck.svg';
import icon_mining from '../../../assets/icon_mining.svg';
import { useRouter } from 'vue-router';
import { ethers } from 'ethers';
import { PROVIDER_RPC_MAIN } from './constant';
import Selector from '../../../components/Selector.vue';
import Header from '../../../components/Header.vue';

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
const selectValue = ref(PROVIDER_RPC_MAIN[0]);
const key = localStorage.getItem('privateKey') || '';

const inputValue = ref(key);
const amtValue = ref(1000);
const canSubmit = computed(() => !!inputValue.value && Number(amtValue.value) > 0);
const submit = () => {
  if (canSubmit.value) {
    try {
      const wallet = new ethers.Wallet(inputValue.value);
      localStorage.setItem('privateKey', inputValue.value);
      router.push({
        path: '/mint/runner',
        query: {
          amt: amtValue.value,
          privateKey: inputValue.value,
          tick: checkValue.value,
          address: wallet.address,
          PROVIDER_RPC: selectValue.value.value
        }
      });
    } catch (e) {
      alert('您输入的密钥不正确');
    }
  }
};
const selectorChange = (item) => {
  selectValue.value = item;
};
</script>

<template>
  <main>
    <Header title="IERC20 采矿" />
    <div class="form">
      <div class="label">配置数据</div>
      <div class="row shadow col">
        <div class="selector-block">
          <Selector
            :width="266"
            :wrapper-height="220"
            :data="PROVIDER_RPC_MAIN"
            :content-height="220"
            :show-value="true"
            @click="selectorChange"
          />
        </div>
        <div class="amt-wrapper">
          <input v-model="amtValue" class="amt-input" placeholder="配置采矿数量" />
        </div>
        <div class="flex" style="margin-top: 16px">
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
      </div>
      <input v-model="inputValue" class="row input shadow" placeholder="填写钱包私钥" />
      <button class="submit shadow" :class="{ disable: loading || !canSubmit }" @click="submit">
        <img :src="icon_mining" :class="{ loading }" alt="" />
        <span>开始采矿</span>
      </button>
    </div>
  </main>
</template>

<style scoped lang="less">
main {
  width: 450px;
}

.amt-wrapper {
  margin-top: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #404040;
  width: 100%;
  .amt-input {
    width: 266px;
    background: #404040;
    padding: 9px 16px;
    border-radius: 40px;
    color: #ccc;
    font-size: 16px;
    outline: none;
    border: none;
  }
}
.selector-block {
  position: relative;
  border-bottom: 1px solid #404040;
  padding: 0 0 16px 0;
  margin: 0 16px;
  width: 100%;
}
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
    padding: 16px 20px;
    align-items: center;
    margin-bottom: 24px;
    &.col {
      flex-direction: column;
    }
  }
  .radio-group {
    display: flex;
    color: #ccc;
    align-items: center;
    cursor: pointer;
    margin-right: 80px;
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
