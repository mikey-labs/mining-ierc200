<script setup>
import { onMounted, ref } from 'vue';
import icon_play from '../../../assets/icon-play.svg';
import icon_stop from '../../../assets/icon-stop.svg';
import { useRoute } from 'vue-router';
import { ethers } from 'ethers';
import { GAS_PREMIUM, ZERO_ADDRESS } from '../Main/constant';
import { stringToHex } from './hex';
import { bnUtils } from './bn';
import Header from '../../../components/Header.vue';

const block = ref(null);
const sleep = async (time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, time);
  });
};
let unique = 0;
let lastNonce = 0;
let lastTimestamp = Date.now();
function generateNonce() {
  const currentTimestamp = Date.now();
  if (currentTimestamp !== lastTimestamp) {
    lastNonce = 0;
    lastTimestamp = currentTimestamp;
  }
  return `${currentTimestamp}${lastNonce++}`;
}

const route = useRoute();
const tokens = {
  'ierc-m4': {
    workc: '0x0000'
    // amt: '100'
  },
  'ierc-m5': {
    workc: '0x00000'
    // amt: '1000'
  }
};
const { tick, address, privateKey, PROVIDER_RPC, amt } = route.query;
const running = ref(true);
const lines = ref([]);
const logger = (info, color = 'green') => {
  lines.value.push({
    text: info,
    color: color
  });
  block.value.scrollTop = block.value.scrollHeight;
};
const run = async () => {
  logger(`您使用的账户地址为： ${address}`);
  const { workc } = tokens[tick];
  const provider = new ethers.providers.JsonRpcProvider(PROVIDER_RPC);
  const miner = new ethers.Wallet(privateKey, provider);

  const network = await provider.getNetwork();
  logger(`使用的网络 ${network.name} (链ID: ${network.chainId})`, 'blue');
  if (!running.value) {
    logger('停止脚本成功!', 'red');
    return;
  }
  const currentGasPrice = await provider.getGasPrice();
  const targetGasFee = currentGasPrice.div(100).mul(GAS_PREMIUM);

  logger(`当前 gas 费用： ${bnUtils.fromWei(targetGasFee.toString(), 9)} gwei`);
  const nonce = await miner.getTransactionCount();
  if (!running.value) {
    logger('停止脚本成功!', 'red');
    return;
  }
  logger(`随机串为： ${nonce}`);
  const balance = await miner.getBalance();
  if (!running.value) {
    logger('停止脚本成功!', 'red');
    return;
  }
  logger(`您的余额为： ${bnUtils.fromWei(balance.toString(), 18).dp(4).toString()}`);

  logger(`设置的采矿数量：${amt},当前采矿难度为： ${workc}`);
  logger(`预计需要1-2分钟进行计算...`);
  logger('正在采矿中...', 'blue');
  await sleep(1000);
  if (!running.value) {
    logger('停止脚本成功!', 'red');
    return;
  }
  let timer = Date.now(),
    startTimer = timer,
    mineCount = 0;

  while (running.value) {
    mineCount += 1;
    const callData = `data:application/json,{"p":"ierc-20","op":"mint","tick":"${tick}","amt":"${amt}","nonce":"${generateNonce()}${unique++}"}`;
    // console.log("🚀 ~ transactionData:", callData)
    const transaction = {
      type: 2,
      chainId: network.chainId,
      to: ZERO_ADDRESS,
      maxPriorityFeePerGas: targetGasFee,
      maxFeePerGas: targetGasFee,
      gasLimit: ethers.BigNumber.from('25000'),
      nonce: nonce,
      value: ethers.utils.parseEther('0'),
      data: stringToHex(callData)
    };
    const rawTransaction = ethers.utils.serializeTransaction(transaction);
    const transactionHash = ethers.utils.keccak256(rawTransaction);
    // console.log("🚀 ~ transactionHash:", transactionHash)

    const signingKey = miner._signingKey();
    const signature = signingKey.signDigest(transactionHash);
    // console.log("🚀 ~ signature:", signature)

    const recreatedSignature = ethers.utils.joinSignature(signature);
    // console.log("🚀 ~ recreatedSignature:", recreatedSignature)

    const predictedTransactionHash = ethers.utils.keccak256(
      ethers.utils.serializeTransaction(transaction, recreatedSignature)
    );
    const now = Date.now();
    if (now - timer > 100) {
      await sleep(1);
      timer = now;
    }
    if (predictedTransactionHash.includes(workc)) {
      unique = 0;
      logger(`${mineCount} - ${predictedTransactionHash}`, 'green');
      const mineTime = (Date.now() - startTimer) / 1000;
      logger(
        `花费总时间为 ${mineTime}s, 平均算力： ${Math.ceil(mineCount / mineTime)} c/s`,
        '#999'
      );
      if (!running.value) {
        logger('停止脚本成功!', 'red');
        return;
      }
      // console.log("🚀 ~ transaction:", transaction)
      const realTransaction = await miner.sendTransaction(transaction);
      // console.log("🚀 ~ realTransaction:", realTransaction)
      logger(`采矿 hash: ${realTransaction.hash}`);
      await realTransaction.wait();
      if (!running.value) {
        logger('停止脚本成功!', 'red');
        return;
      }
      logger('采矿成功！');
      return run();
    }
  }
};

const runOrStop = () => {
  running.value = !running.value;
  if (running.value) {
    lines.value = [];
    run();
  }
};
onMounted(run);
</script>

<template>
  <main>
    <Header title="IERC20 采矿" />
    <div class="form">
      <div class="row shadow">
        <div class="loading-block">
          <img src="../../../assets/icon_loading.svg" alt="" :class="{ loading: running }" />
          <span class="label">采矿中...</span>
        </div>
        <div class="opera">
          <div class="opera clear" @click="lines = []">
            <img src="../../../assets/icon-clear.svg" alt="" />
            清除
          </div>
          <img :src="running ? icon_stop : icon_play" alt="" class="stop" @click="runOrStop" />
        </div>
      </div>
      <div ref="block" class="command">
        <div
          v-for="(item, i) in lines"
          :key="i"
          class="line"
          :style="{
            color: item.color
          }"
        >
          {{ item.text }}
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped lang="less">
main {
  width: 560px;
}
.opera {
  display: flex;
  align-items: center;
  color: white;
  font-size: 14px;
  &.clear {
    padding-right: 16px;
    cursor: pointer;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.loading {
  animation: linear 1s infinite rotate;
}

.form {
  margin-top: 64px;
  width: 560px;
  border-radius: 8px;
  overflow: hidden;
  .loading-block {
    display: flex;
    align-items: center;
  }
  .row {
    background: #2a82e4;
    display: flex;
    padding: 0 20px;
    align-items: center;
    justify-content: space-between;
    height: 60px;
  }
  .stop {
    cursor: pointer;
  }
  .label {
    font-size: 18px;
    margin-left: 8px;
    color: white;
  }
  .command {
    overflow-x: hidden;
    overflow-y: auto;
    height: 300px;
    padding: 20px;
    background: #ececec;
    .line {
      word-break: break-all;
      font-size: 16px;
    }
  }
}
</style>
