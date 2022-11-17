import { CHAIN_ID_NEON } from '@certusone/wormhole-sdk';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const isTestnet = Number(process.env.TESTNET_MODE);

// thredhold amount is defined as "amount that will show on VAA"
// address should be **lower case** address to be consistent
const RELAYER_SUPPORTED_ADDRESSES_AND_THRESHOLDS_DEV = {
  [CHAIN_ID_NEON]: {
    // 0.1 BSC USDT => Neon WUSDT
    '0x337610d27c682e347c9cd60bd4b3b107c9d34ddd': '10000000',

    // 0.02 BSC ETH => Neon WETH ?
    '0xd66c6b4f0be8ce5b39d52e0fd1344c389929b378': '2000000',

    // 0.05 Goerli USDC => Neon WUSDC
    '0x07865c6e87b9f70255377e024ace6630c1eaa37f': '50000',

    // BNB => Neon WBNB
    '0xae13d989dac2f0debff460ac112a837c89baa7cd': '1',

    '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6': '1'
  }
};

const RELAYER_SUPPORTED_ADDRESSES_AND_THRESHOLDS_PROD = {
  [CHAIN_ID_NEON]: null
};

export const RELAYER_SUPPORTED_ADDRESSES_AND_THRESHOLDS = isTestnet
  ? RELAYER_SUPPORTED_ADDRESSES_AND_THRESHOLDS_DEV
  : RELAYER_SUPPORTED_ADDRESSES_AND_THRESHOLDS_PROD;

export const TESTNET_MODE_WARNING = `
  ----------------------------
  🔨 running in testnet mode
  ❌ don't use it for mainnet!
  ----------------------------
`;

export const VERSION = '1.1.0';
