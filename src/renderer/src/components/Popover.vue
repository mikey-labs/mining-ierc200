<script setup>

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true
  },
  title:{
    type:String,
    default:"ddd"
  }
});
const emits = defineEmits(['modelValue:update']);
</script>

<template>
  <transition name="popIn" duration="500">
    <div v-if="modelValue" class="popover">
      <div class="popover-body">
        <div class="head">
          {{title}}
          <img class="close" src="../assets/icon-close.svg" />
        </div>
        <div class="body">
          <slot />
        </div>
      </div>
    </div>
  </transition>
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
  .head{
    position: relative;
    padding: 12px 16px;
    color: #ccc;
    font-size: 16px;
    text-align: center;
    border-bottom: 1px solid #232323;
    .close{
      position: absolute;
      z-index: 1;
      right: 16px;
      top: 12px;
    }
  }
  .popover-body {
    width: 480px;
    height: 350px;
    background: #1a1a1a;
    border-radius: 8px;
    border: 1px #232323 solid;
    .body{
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
