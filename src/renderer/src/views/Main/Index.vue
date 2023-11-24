<script setup></script>

<template>
  <main>
    <div class="header">
      <div>IERC200 挖矿工具</div>
      <div class="desc">开启你的挖矿之旅</div>
    </div>
    <div class="form">
      <input class="input shadow" placeholder="填写您的钱包私钥" />
      <button class="submit shadow">
        <img src="../../assets/icon-submit.svg" />
      </button>
    </div>
  </main>
</template>

<style scoped lang="less">
.shadow {
  box-shadow: 0 2px 4px #000000;
}
.header {
  padding-top: 75px;
  display: flex;
  font-size: 30px;
  flex-direction: column;
  font-weight: 500;
  color: white;
  align-items: center;
  .desc {
    font-size: 16px;
    font-weight: 400;
    color: #ccc;
  }
}
.form {
  display: flex;
  justify-content: center;
  margin-top: 120px;
  .input {
    padding: 0 20px;
    outline: none;
    border: none;
    font-size: 18px;
    background: #303030;
    color: white;
    height: 60px;
    border-radius: 8px;
    width: 390px;
  }
  .submit {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    border: none;
    margin-left: 10px;
    -webkit-appearance: none;
    background: #2a82e4;
  }
}
</style>
