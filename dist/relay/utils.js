"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.relayEVM = exports.shouldRelay = exports.shouldRelayVaa = exports.parseVaa = void 0;
const wormhole_sdk_1 = require("@certusone/wormhole-sdk");
const wormhole_sdk_wasm_1 = require("@certusone/wormhole-sdk-wasm");
const ethers_1 = require("ethers");
const consts_1 = require("./consts");
const parseVaa = async (bytes) => {
    const { parse_vaa } = await (0, wormhole_sdk_wasm_1.importCoreWasm)();
    const parsedVaa = parse_vaa(bytes);
    const buffered = Buffer.from(new Uint8Array(parsedVaa.payload));
    return (0, wormhole_sdk_1.parseTransferPayload)(buffered);
};
exports.parseVaa = parseVaa;
const shouldRelayVaa = (vaaInfo) => {
    const { amount, targetChain, originChain, originAddress, } = vaaInfo;
    let originChainParsed = wormhole_sdk_1.CHAINS[wormhole_sdk_1.CHAIN_ID_TO_NAME[originChain]];
    const originAsset = (0, wormhole_sdk_1.tryHexToNativeString)(originAddress, originChainParsed);
    const res = (0, exports.shouldRelay)({ targetChain, originAsset, amount });
    const info = JSON.stringify({ targetChain, originAsset, amount, res }, (key, value) => typeof value === 'bigint' ? value.toString() : value);
    console.log(`check should relay VAA: ${info}`);
    return res;
};
exports.shouldRelayVaa = shouldRelayVaa;
const shouldRelay = ({ targetChain, originAsset, amount: _amount, }) => {
    const _noRelay = (msg) => ({ shouldRelay: false, msg });
    if (!targetChain)
        return _noRelay('missing targetChain');
    if (!originAsset)
        return _noRelay('missing originAsset');
    if (!_amount)
        return _noRelay('missing transfer amount');
    let amount;
    try {
        amount = BigInt(_amount);
    }
    catch (e) {
        return _noRelay(`failed to parse amount: ${_amount}`);
    }
    const supported = consts_1.RELAYER_SUPPORTED_ADDRESSES_AND_THRESHOLDS[targetChain];
    if (!supported)
        return _noRelay('target chain not supported');
    const minTransfer = supported[originAsset.toLowerCase()];
    if (!minTransfer)
        return _noRelay('token not supported');
    if (amount < BigInt(minTransfer))
        return _noRelay(`transfer amount too small, expect at least ${minTransfer}`);
    return { shouldRelay: true, msg: '' };
};
exports.shouldRelay = shouldRelay;
const relayEVM = async (chainConfigInfo, signedVAA) => {
    const provider = new ethers_1.ethers.providers.JsonRpcProvider(chainConfigInfo.nodeUrl);
    const signer = new ethers_1.ethers.Wallet(chainConfigInfo.walletPrivateKey, provider);
    const receipt = await (0, wormhole_sdk_1.redeemOnEth)(chainConfigInfo.tokenBridgeAddress, signer, (0, wormhole_sdk_1.hexToUint8Array)(signedVAA));
    return receipt;
};
exports.relayEVM = relayEVM;
