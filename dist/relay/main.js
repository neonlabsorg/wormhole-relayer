"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVersion = exports.checkShouldRelay = exports.relay = void 0;
const wormhole_sdk_1 = require("@certusone/wormhole-sdk");
const configureEnv_1 = require("../configureEnv");
const consts_1 = require("./consts");
const utils_1 = require("./utils");
const env = (0, configureEnv_1.validateEnvironment)();
const getChainConfigInfo = (chainId) => {
    return env.supportedChains.find((x) => x.chainId === chainId);
};
const validateRequest = async (request, response) => {
    const chainId = request.body?.targetChain;
    const chainConfigInfo = getChainConfigInfo(chainId);
    if (!chainConfigInfo) {
        return response.status(400).json({ error: 'Unsupported chainId', chainId });
    }
    const signedVAA = request.body?.signedVAA;
    if (!signedVAA) {
        return response.status(400).json({ error: 'signedVAA is required' });
    }
    // parse & validate VAA, make sure we want to relay this request
    const vaaInfo = await (0, utils_1.parseVaa)((0, wormhole_sdk_1.hexToUint8Array)(signedVAA));
    const vaaInfoString = JSON.stringify(vaaInfo, (key, value) => typeof value === 'bigint' ? value.toString() : value);
    console.log(`parsed VAA info: ${vaaInfoString}`);
    const { shouldRelay: _shouldRelay, msg } = (0, utils_1.shouldRelayVaa)(vaaInfo);
    if (!_shouldRelay) {
        return response.status(400).json({
            error: msg,
            vaaInfo: {
                ...vaaInfo,
                amount: vaaInfo.amount.toString()
            }
        });
    }
    return { chainConfigInfo, chainId, signedVAA };
};
const relay = async (request, response) => {
    const { chainConfigInfo, chainId, signedVAA } = await validateRequest(request, response);
    if (!chainConfigInfo)
        return;
    const relayInfo = JSON.stringify({ chainId, signedVAA });
    console.log(`relaying: ${relayInfo}`);
    try {
        const receipt = await (0, utils_1.relayEVM)(chainConfigInfo, signedVAA);
        console.log(`Relay Succeed 🎉🎉: ${relayInfo}, txHash: ${receipt.transactionHash}`);
        response.status(200).json(receipt);
    }
    catch (e) {
        console.log(`Relay Failed ❌: ${relayInfo}`);
        console.error(e);
        return response.status(500).json({ error: e, msg: 'Unable to relay this request.' });
    }
};
exports.relay = relay;
const checkShouldRelay = (request, response) => {
    const res = (0, utils_1.shouldRelay)(request.query);
    console.log(`checkShouldRelay: ${JSON.stringify({ ...request.query, ...res })}`);
    response.status(200).json(res);
};
exports.checkShouldRelay = checkShouldRelay;
const getVersion = (request, response) => response.status(200).end(consts_1.VERSION);
exports.getVersion = getVersion;
