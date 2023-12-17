export const PROVIDER_RPC_MAIN = [
  {
    label: 'llamarpc 正式网络',
    value: 'https://eth.llamarpc.com'
  },

  {
    label: 'linea 正式网络',
    value: 'https://linea.blockpi.network/v1/rpc/public'
  },
  {
    label: 'goerli 测试网络',
    value: 'https://goerli.blockpi.network/v1/rpc/public'
  },
  {
    label: 'sepolia 测试网络',
    value: 'https://ethereum-sepolia.blockpi.network/v1/rpc/public'
  }
];
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const GAS_PREMIUM = 110;
export const ETHEREUM_RPC_MAIN = [
  {
    label: 'IERC20 主网络',
    value:
      'https://rpc.walletconnect.org/v1/?chainId=eip155:1&projectId=43cb541b9d2bd1b006e811356e0b3191'
  },
  {
    label: 'Ethereum 主网络',
    value: 'https://ethereum.blockpi.network/v1/rpc/public'
  },
  ...PROVIDER_RPC_MAIN
];
export const IERC20_ADDRESS = '0x33302dbff493ed81ba2e7e35e2e8e833db023333';
