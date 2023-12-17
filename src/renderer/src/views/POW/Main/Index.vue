<script setup>
import { ref } from 'vue';
import Header from '../../../components/Header.vue';
import Lister from './components/Lister.vue';
import icon_add from '../../../assets/icon-add.svg';
import icon_reduce from '../../../assets/icon-reduce.svg';

const counter = ref(1);
const add = () => {
  counter.value = counter.value + 1;
};
const reduce = () => {
  counter.value = counter.value - 1;
};
</script>

<template>
  <main>
    <Header title="铭文市场">
      <template #right>
        <div>
          <img :src="icon_add" title="新增列表" alt="" style="margin-right: 10px" @click="add" />
          <img :src="icon_reduce" title="移除列表" alt="" @click="reduce" />
        </div>
      </template>
    </Header>
    <div class="container">
      <template v-for="item in counter" :key="item">
        <Lister />
      </template>
    </div>
  </main>
</template>

<style scoped lang="less">

</style>
