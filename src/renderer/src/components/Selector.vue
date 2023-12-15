<script setup>
import { ref } from 'vue';
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  showValue: {
    type: Boolean,
    default: false
  },
  wrapperHeight: {
    type: String,
    default: '156px'
  },
  width: {
    type: String,
    default: '140px'
  },
  height: {
    type: String,
    default: '36px'
  },
  contentHeight: {
    type: String,
    default: '156px'
  },
  radius: {
    type: String,
    default: '40px'
  }
});
const emit = defineEmits(['change']);
const showDropDownList = ref(false);
const selectValue = ref(props.data[0]);
const selectorChange = (item) => {
  selectValue.value = item;
  showDropDownList.value = !showDropDownList.value;
  emit('change', item);
};
</script>

<template>
  <div
    class="selector-wrapper"
    :style="{
      '--content-height': props.contentHeight,
      '--holder-height': height
    }"
  >
    <div
      :style="{
        width: width,
        borderRadius: radius,
        height: height
      }"
      class="selector"
      @click="showDropDownList = !showDropDownList"
    >
      {{ selectValue.label }}
      <img src="../assets/arrow.svg" alt="" />
    </div>
    <transition duration="500" name="slideIn">
      <div
        v-show="showDropDownList"
        class="list"
        :style="{
          width: width,
          maxHeight: wrapperHeight
        }"
      >
        <div v-for="(item, i) in data" :key="i" class="item" @click="selectorChange(item)">
          <div>
            {{ item.label }}
          </div>
          <div v-if="showValue" class="tip">{{ item.value }}</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="less">
.selector-wrapper {
  position: relative;
  .selector {
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    background: #404040;
    color: #ccc;
    font-size: 16px;
    &:hover {
      background: #454545;
    }
  }
  .list {
    position: absolute;
    top: calc(var(--holder-height) + 4px);
    left: 0;
    background: #404040;
    border-radius: 8px;
    box-sizing: border-box;
    overflow: auto;
    .item {
      &:hover {
        background: #454545;
      }
      cursor: pointer;
      font-size: 16px;
      color: #999;
      padding: 16px;
      background: #404040;
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

.slideIn-enter-from,
.slideIn-leave-to {
  height: 0;
}
// 元素进入结束的状态 ｜ 元素开始离开的状态。 这里不写也可以！！！！！！
.slideIn-enter-to,
.slideIn-leave-from {
  height: var(--content-height);
}
// 元素进入 ｜ 结束时，过渡的效果
.slideIn-enter-active,
.slideIn-leave-active {
  // 过渡动画的使用
  transition: height 0.2s;
}
</style>
