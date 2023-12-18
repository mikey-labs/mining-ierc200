<script setup>
import Header from '../../../components/Header.vue';
import Tabs from '../../../components/Tabs.vue';
import { ref } from 'vue';
import HexChanger from './components/HexChanger.vue';
const data = [
  {
    label: '交易Data解析',
    value: 1
  },
  {
    label: '其他',
    value: 2
  }
];
const active = ref(data[0].value);
const tabChange = (item) => {
  active.value = item.value;
};
</script>
<template>
  <main>
    <Header title="常用工具" />
    <Tabs :data="data" style="margin-top: 50px" @change="tabChange" />
    <div class="container">
      <HexChanger v-show="active === 1" />
    </div>
  </main>
</template>

<style scoped lang="less">
main {
  padding: 15px 10px;
}
.container {
  margin-top: 0;
  padding-bottom: 50px;
}
</style>
