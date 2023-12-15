<script setup>
import { ref, watch } from 'vue';
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
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
    default: '#303030'
  },
  radius: {
    type: String,
    default: '8px'
  },
  fontSize: {
    type: String,
    default: '18px'
  }
});
const value = ref(props.modelValue);
watch(
  () => props.modelValue,
  (n) => {
    value.value = n;
  }
);
const emits = defineEmits(['update:modelValue']);
watch(value, (n) => {
  emits('update:modelValue', n);
});
</script>

<template>
  <input
    v-model="value"
    class="input"
    :placeholder="placeholder"
    :style="{
      width: width,
      background: background,
      height: height,
      borderRadius: radius,
      fontSize: fontSize
    }"
  />
</template>

<style scoped lang="less">
.input {
  padding: 0 20px;
  outline: none;
  border: none;
  color: #ccc;
}
</style>
