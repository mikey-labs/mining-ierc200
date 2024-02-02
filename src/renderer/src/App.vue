<script setup>
navigator.serviceWorker.register('sw.js');
</script>

<template>
  <RouterView> </RouterView>
</template>

<style lang="less">
@import './assets/css/styles.less';
</style>
