<script setup>
import icon_volume from '../../../../assets/statistics/icon-volume.svg';
import icon_supply from '../../../../assets/statistics/icon-supply.svg';
import icon_floor_price from '../../../../assets/statistics/icon-floor-price.svg';
defineProps({
  data: {
    type: Object,
    default: () => {}
  }
});
const goSite = (url) => {
  window.open(url, '_blank');
}
</script>

<template>
  <div class="block">
    <div class="head">
      {{ data.tick }}
      <span class="check" @click="goSite(data.url)">去市场</span>
    </div>
    <div>
      <div class="item">
        <div class="title">市值：</div>
        <div class="value">
          <img :src="icon_volume" />
          <span class="text volume">{{ data.volume }} ETH</span>
        </div>
      </div>
      <div class="item">
        <div class="title">供应量：</div>
        <div class="value">
          <img :src="icon_supply" />
          <span class="text">{{ data.totalSupply }}</span>
        </div>
      </div>
      <div class="item">
        <div class="title">底价：</div>
        <div class="value">
          <img :src="icon_floor_price" />
          <span class="text floor">${{ data.floorPrice }}</span>
          <!--        <span class="check" @click="goSite(data.url)">去市场</span>-->

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.block {
  padding: 0 10px;
  background: #333;
  border-radius: 8px;
  margin-right: 20px;
  margin-bottom: 20px;
  width: 232px;
  &:nth-child(3n) {
    margin-right: 0;
  }
  .check{
    color: #2A82E4;
    font-size: 12px;
    cursor: pointer;
    font-weight: normal;
    &:hover{
      text-decoration: underline;
    }
  }
  .head {
    font-size: 18px;
    font-weight: 500;
    padding: 8px 0;
    color: #ccc;
    display: flex;
    align-items: end;
    justify-content: space-between;
    border-bottom: 1px solid #444;
    position: relative;
  }
  .item {
    padding: 6px 6px;
    display: flex;
    justify-content: space-between;
    &:first-child{
      margin-top: 4px;
    }
    &:last-child{
      margin-bottom: 8px;
    }
    .title {
      font-size: 12px;
      color: #999;
    }
    .value {
      display: flex;
      align-items: center;
      font-size: 16px;
      .text {
        margin-left: 4px;
        &.volume {
          color: #ae6605;
        }
        &.floor {
          font-weight: 500;
          color: #c1b3ff;
        }
      }
    }
  }
}
</style>
