<script setup>
import { ref } from 'vue';
import icon_back from '../../assets/icon-back.svg';
import icon_play from '../../assets/icon-play.svg';
import icon_stop from '../../assets/icon-stop.svg';
import { useRoute, useRouter } from 'vue-router';
import { ethers } from 'ethers';
import { GAS_PREMIUM, PROVIDER_RPC, ZERO_ADDRESS } from '../Main/constant';
import dayjs from 'dayjs';
import { stringToHex } from './hex';
import { bnUtils } from './bn';
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

const router = useRouter();
const route = useRoute();
const tokens = {
  'ierc-m4': {
    workc: '0x0000',
    amt: '1000'
  },
  'ierc-m5': {
    workc: '0x00000',
    amt: '1000'
  }
};
const { tick, address, privateKey } = route.query;
const running = ref(true);
const lines = ref([]);
const logger = (info, color = 'green') => {
  lines.value.push({
    text: info,
    color: color
  });
};
const run = async () => {
  logger(`Start mining with ${address}`);
  const { amt, workc } = tokens[tick];
  const provider = new ethers.providers.JsonRpcProvider(PROVIDER_RPC);
  const miner = new ethers.Wallet(privateKey, provider);

  const network = await provider.getNetwork();
  logger(`network is ${network.name} (chainID: ${network.chainId})`);
  if (!running.value) {
    logger('Script stopped!', 'red');
    return;
  }
  const currentGasPrice = await provider.getGasPrice();
  const targetGasFee = currentGasPrice.div(100).mul(GAS_PREMIUM);

  logger(`Current gas price usage ${bnUtils.fromWei(targetGasFee.toString(), 9)} gwei`);
  const nonce = await miner.getTransactionCount();
  if (!running.value) {
    logger('Script stopped!', 'red');
    return;
  }
  logger(`nonce is ${nonce}`);
  const balance = await miner.getBalance();
  if (!running.value) {
    logger('Script stopped!', 'red');
    return;
  }
  logger(`balance is ${bnUtils.fromWei(balance.toString(), 18).dp(4).toString()}`);

  logger(`The current mining difficulty is ${workc}`);
  logger(`Expected to take 1-2 minutes to calculate...`);
  logger('start mining...', 'blue');
  await sleep(1000);
  if (!running.value) {
    logger('Script stopped!', 'red');
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
      if (!running.value) {
        logger('Script stopped!', 'red');
        return;
      }
      logger(
        `[${dayjs(now).format('YYYY-MM-DD HH:mm:ss')}] ${mineCount} - ${predictedTransactionHash}`,
        'red'
      );
      timer = now;
    }

    if (predictedTransactionHash.includes(workc)) {
      unique = 0;
      logger(`${mineCount} - ${predictedTransactionHash}`, 'green');
      const mineTime = (Date.now() - startTimer) / 1000;
      logger(
        `Total time spent ${mineTime}s, average arithmetic ${Math.ceil(mineCount / mineTime)} c/s`,
        '#999'
      );
      if (!running.value) {
        logger('Script stopped!', 'red');
        return;
      }
      // console.log("🚀 ~ transaction:", transaction)
      const realTransaction = await miner.sendTransaction(transaction);
      // console.log("🚀 ~ realTransaction:", realTransaction)
      logger(`mining hash: ${realTransaction.hash}`, '#999');
      await realTransaction.wait();
      if (!running.value) {
        logger('Script stopped!', 'red');
        return;
      }
      return logger('mining success');
    }
  }
};
run();
const back = () => {
  router.back();
};
const runOrStop = () => {
  running.value = !running.value;
  if (running.value) {
    run();
  } else {
  }
};
</script>

<template>
  <main>
    <div class="back" @click="back">
      <img :src="icon_back" alt="" />
    </div>
    <div class="header">
      <div>
        <div>IERC200 挖矿工具</div>
      </div>
    </div>
    <div class="form">
      <div class="row shadow">
        <div class="loading-block">
          <img src="../../assets/icon_loading.svg" alt="" :class="{ loading: running }" />
          <span class="label">挖矿中...</span>
        </div>
        <img :src="running ? icon_stop : icon_play" alt="" class="stop" @click="runOrStop" />
      </div>
      <div class="command">
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
.shadow {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}
.back {
  position: absolute;
  left: 40px;
  top: 40px;
  cursor: pointer;
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
.header {
  padding-top: 75px;
  display: flex;
  font-size: 32px;
  flex-direction: column;
  font-weight: 500;
  color: white;
  align-items: center;
}
.form {
  margin-top: 64px;
  width: 520px;
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
      font-size: 16px;
    }
  }
}
</style>
