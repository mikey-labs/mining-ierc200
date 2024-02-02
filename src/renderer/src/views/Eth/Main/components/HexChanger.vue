<script setup>
import {ref} from "vue";
import {decodeTransactionData, encodeTransactionData} from "../../../../util";

const input = ref('');
const output = ref('');
const inputChange = () => {
  output.value = decodeTransactionData(input.value);
}
const outputChang = () => {
  input.value = encodeTransactionData(output.value);
}
</script>

<template>
  <div class="tab-panel">
    <div class="panel">
      <div>交易Data数据</div>
      <textarea v-model="input"> </textarea>
    </div>
    <div class="change-wrapper">
      <div class="change-btn reverse" @click="inputChange">
        <img src="../../../../assets/icon-change.svg" />
      </div>
      <div class="change-btn" @click="outputChang">
        <img src="../../../../assets/icon-change.svg" />
      </div>
    </div>
    <div class="panel right">
      <div>解码结果</div>
      <textarea v-model="output"> </textarea>
    </div>
  </div>
</template>

<style scoped lang="less">
.tab-panel {
  border: 1px solid #333;
  border-radius: 0px 0px 8px 8px;
  border-bottom: none;
  padding: 20px;
  height: 100%;
  display: flex;
  background: #121212;
  .change-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
    .change-btn {
      margin-bottom: 20px;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      cursor: pointer;
      transition: opacity 0.5s;
      &.reverse {
        transform: rotateY(180deg);
      }
      &:hover {
        opacity: 0.75;
      }
    }
  }
  .panel {
    flex: 1;
    flex-direction: column;
    align-items: center;
    display: flex;
    height: 100%;
    font-size: 16px;
    textarea {
      margin-top: 4px;
      width: 100%;
      text-align: left;
      color: #ccc;
      outline: none;
      border: none;
      border-radius: 8px;
      background: #333;
      flex: 1;
      padding: 16px;
      font-size: 14px;
    }
  }
}
</style>
