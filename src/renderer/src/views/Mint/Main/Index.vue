<script setup>
import { computed, ref } from 'vue';
import icon_check from '../../../assets/check.svg';
import icon_uncheck from '../../../assets/uncheck.svg';
import icon_mining from '../../../assets/icon_mining.svg';
import { useRouter } from 'vue-router';
import { ethers } from 'ethers';
import { PROVIDER_RPC_MAIN } from './constant';
import icon_back from '../../../assets/icon-back.svg';

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
const showDropDownList = ref(false);
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
  showDropDownList.value = !showDropDownList.value;
};
const back = () => {
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
        <div>IERC20 采矿</div>
      </div>
    </div>
    <div class="form">
      <div class="label">配置数据</div>
      <div class="row shadow col">
        <div class="selector-wrapper">
          <div class="selector" @click="showDropDownList = !showDropDownList">
            {{ selectValue.label }}
            <img src="../../../assets/arrow.svg" alt="" />
          </div>
          <transition duration="500" name="slideIn">
            <div v-show="showDropDownList" class="list">
              <div
                v-for="(item, i) in PROVIDER_RPC_MAIN"
                :key="i"
                class="item"
                @click="selectorChange(item)"
              >
                <div>
                  {{ item.label }}
                </div>
                <div class="tip">{{ item.value }}</div>
              </div>
            </div>
          </transition>
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
main{
  width: 450px;
}
.back {
  position: absolute;
  left: 40px;
  top: 40px;
  cursor: pointer;
}
.flex {
  display: flex;
  align-items: center;
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
.selector-wrapper {
  position: relative;
  border-bottom: 1px solid #404040;
  padding: 0 0 16px 0;
  margin: 0 16px;
  width: 100%;
  .selector {
    cursor: pointer;
    width: 266px;
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
    width: 266px;
    background: #404040;
    border-radius: 8px;
    max-height: 220px;
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
      .tip {
        word-break: break-all;
        font-size: 12px;
        color: #888;
        margin-top: 4px;
      }
    }
  }
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
.header {
  padding-top: 30px;
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
