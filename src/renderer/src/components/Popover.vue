<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    default: ''
  }
});
const emits = defineEmits(['update:modelValue']);
</script>

<template>
  <Teleport to="body">
    <div v-show="modelValue" class="popover">
      <transition name="popIn" duration="500" appear-class="popover-body">
        <div v-if="modelValue" class="popover-body">
          <div class="head">
            {{ title }}
            <img
              class="close"
              src="../assets/icon-close.svg"
              @click="emits('update:modelValue', false)"
            />
          </div>
          <div class="body">
            <slot />
          </div>
        </div>
      </transition>
    </div>
  </Teleport>
</template>

<style scoped lang="less">
.popover {
  background: rgba(0, 0, 0, 0.75);
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  .head {
    position: relative;
    padding: 16px;
    color: #ccc;
    font-size: 18px;
    text-align: center;
    border-bottom: 1px solid #232323;
    .close {
      position: absolute;
      z-index: 1;
      right: 16px;
      top: 12px;
      cursor: pointer;
      transition: opacity 0.5s;
      &:hover {
        opacity: 0.5;
      }
    }
  }
  .popover-body {
    width: 480px;
    min-height: 350px;
    background: #1a1a1a;
    border-radius: 8px;
    border: 1px #232323 solid;
    .body {
      padding: 16px;
    }
  }
}

.popIn-enter-from,
.popIn-leave-to {
  transform: scale(0.5);
}
// 元素进入结束的状态 ｜ 元素开始离开的状态。 这里不写也可以！！！！！！
.popIn-enter-to,
.popIn-leave-from {
  transform: scale(1);
}
// 元素进入 ｜ 结束时，过渡的效果
.popIn-enter-active,
.popIn-leave-active {
  // 过渡动画的使用
  transition: transform 0.5s;
}
</style>
