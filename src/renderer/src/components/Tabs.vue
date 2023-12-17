<script setup>
import Button from './Button.vue';
import { ref } from 'vue';
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
});
const active = ref(props.data[0].value);
const emits = defineEmits(['change']);
const change = (item) => {
  active.value = item.value;
  emits('change', item);
};
</script>

<template>
  <div class="tabs">
    <div v-for="(item, i) in data" :key="i">
      <Button
        :class="{ active: active === item.value }"
        height="40px"
        width="auto"
        :background="active === item.value ? '#677e87' : 'transparent'"
        class="tab"
        @click="change(item)"
      >
        {{ item.label }}
      </Button>
    </div>
  </div>
</template>

<style scoped lang="less">
.tabs {
  display: flex;
  align-items: center;
  border: 1px solid #333;
  padding: 8px 10px;
  background: #121212;
  border-radius: 8px 8px 0 0;
  border-bottom: none;
  .tab {
    padding: 8px 12px;
    border-radius: 8px;
    color: #999;
    font-size: 14px;
    margin-right: 10px;
    font-weight: normal;
    &.active {
      color: #fff;
    }
  }
}
</style>
