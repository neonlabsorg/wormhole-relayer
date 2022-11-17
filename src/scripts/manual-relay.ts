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
  const vaa = '010000000001000b6fb6b81e783d87486196b25db4690da82fbcad403a7f1acb01a823bcfa5f813eeef7bede85dee7f484f85c5282a835214cc8f77a259f6b1392f2efaf6781aa01636e18f4fd9e00000002000000000000000000000000f890982f9310df57d00f659cf4fd87e65aded8d70000000000000a01010100000000000000000000000000000000000000000000000000000000000186a0000000000000000000000000b4fbf271143f4fbf7b91a5ded31805e42b2208d60002000000000000000000000000b1569a0d87c7b1eb07b41f10c7816117e38ca9f400110000000000000000000000000000000000000000000000000000000000000000';

  await manualRelayVAA(relayerUrl, CHAIN_ID_NEON, vaa);
})();
