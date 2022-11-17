"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const main_1 = require("./relay/main");
const consts_1 = require("./relay/consts");
dotenv_1.default.config({ path: '.env' });
const PORT = process.env.PORT || 3111;
const startServer = async () => {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    app.use(body_parser_1.default.json());
    app.post('/relay', main_1.relay);
    app.get('/shouldRelay', main_1.checkShouldRelay);
    app.get('/version', main_1.getVersion);
    app.listen(PORT, () => {
        console.log(`
      ----------------------------------------------------------------
      ⚡               relayer running on port ${PORT}               ⚡
      ----------------------------------------------------------------
      NEON_ETH_RPC_URL          : ${process.env.NEON_ETH_RPC_URL}
      TESTNET_MODE              : ${process.env.TESTNET_MODE}
      VERSION                   : ${consts_1.VERSION}
      ----------------------------------------------------------------
    `);
        Number(process.env.TESTNET_MODE) && console.log(consts_1.TESTNET_MODE_WARNING);
    });
};
startServer().catch((e) => {
    console.log('❗️❗️ something is wrong with relayer: ', e);
    process.exit(1);
});
