<script setup>
defineProps({
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '60px'
  },
  background: {
    type: String,
    default: '#2a82e4'
  },
  radius: {
    type: String,
    default: '8px'
  },
  disable: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <button
    :disable="disable"
    :style="{
      width,
      height,
      background,
      borderRadius: radius
    }"
    class="button"
    :class="{
      disable: disable
    }"
  >
    <slot />
  </button>
</template>

<style scoped lang="less">
.button {
  &:hover {
    opacity: 0.7;
  }
  transition: all 0.5s;
  cursor: pointer;
  border: none;
  color: white;
  -webkit-appearance: none;
  font-size: 18px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  &.disable,
  &.disable:hover {
    opacity: 1;
    background: #808080 !important;
    cursor: default !important;
  }
}
</style>
