import { ethers } from 'ethers';

export const runWallet = (privateKey) => {
  try {
    const wallet = new ethers.Wallet(privateKey);
    localStorage.setItem(
      `/${wallet.address}`,
      JSON.stringify({
        privateKey: wallet.privateKey,
        mnemonic: wallet.mnemonic
      })
    );
    console.log('Mining account created successfully');
    return true;

  } catch (e) {
    console.log('Mining account created failed');
    return false;

  }
};
