<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  }
});
const emits = defineEmits(['close']);
</script>

<template>
  <div class="toast">
    <div class="title">
      {{ title }}
      <img class="close" src="../assets/icon-close-circle.svg" @click="emits('close')" />
    </div>
    <div class="body">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="less">
.toast {
  position: fixed;
  right: 16px;
  top: 16px;
  z-index: 999;
  padding: 12px 40px 12px 16px;
  background: #ff8e0d;
  border-radius: 8px;
  .title {
    font-size: 16px;
    font-weight: 500;
    color: #fff;
    .close {
      cursor: pointer;
      position: absolute;
      top: 8px;
      right: 8px;
    }
  }
  .body{
    font-size: 14px;
    margin-top: 4px;
    color: #efefef;
  }
}
</style>
