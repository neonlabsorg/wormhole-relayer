import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { relay, checkShouldRelay, getVersion } from './relay/main';
import { TESTNET_MODE_WARNING, VERSION } from './relay/consts';

dotenv.config({ path: '.env' });
const PORT = process.env.PORT || 3111;

const startServer = async (): Promise<void> => {
  const app = express();

  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.post('/relay', relay);
  app.get('/shouldRelay', checkShouldRelay);
  app.get('/version', getVersion);

  app.listen(PORT, () => {
    console.log(`
      ----------------------------------------------------------------
      ⚡               relayer running on port ${PORT}               ⚡
      ----------------------------------------------------------------
      NEON_ETH_RPC_URL        : ${process.env.NEON_ETH_RPC_URL}
      TESTNET_MODE              : ${process.env.TESTNET_MODE}
      VERSION                   : ${VERSION}
      ----------------------------------------------------------------
    `);

    Number(process.env.TESTNET_MODE) && console.log(TESTNET_MODE_WARNING);
  });
};

startServer().catch((e) => {
  console.log('❗️❗️ something is wrong with relayer: ', e);
  process.exit(1);
});
