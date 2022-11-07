import { CHAIN_ID_NEON } from '@certusone/wormhole-sdk';
import { ChainId } from '@certusone/wormhole-sdk';
import axios from 'axios';

const manualRelayVAA = async (relayerUrl: string, targetChain: ChainId, signedVAA: string) => {
  try {
    const res = await axios.post(`${relayerUrl}/relay`, {
      targetChain: CHAIN_ID_NEON,
      signedVAA,
    });

    console.log(`
      ---------------------------------------
      ---------- Relay Succeed 🎉🎉 ----------
      ---------------------------------------
    `);

    console.log(res.data);

  } catch (e) {
    console.log(`
      -------------------------------------
      ---------- Relay Failed ❌ ----------
      -------------------------------------
    `);

    console.error(e);
  }
};

(async () => {
  const relayerUrl = 'http://localhost:3111';
  const vaa = '01000000000100dde347a99a329041b3641c8472a85c04afdc2afc03c796251e16af8c65e291282c391228fe29e8417031d1c1d7f34f7bc6d89f4a46a17b9a9f87bfb8533c7fa7016368e7ff4ce5000000040000000000000000000000009dcf9d205c9de35334d646bee44b2d2859712a0900000000000009e10f0100000000000000000000000000000000000000000000000000000000000186a0000000000000000000000000ae13d989dac2f0debff460ac112a837c89baa7cd0004000000000000000000000000c164b9ed3b621dd4f2ced98284e28c2cf9d89bab00110000000000000000000000000000000000000000000000000000000000000000';

  await manualRelayVAA(relayerUrl, CHAIN_ID_NEON, vaa);
})();
