const {ethers} = require('ethers');
const {apiGet, apiPost} = require("../../utils/http");
const {ABI_LAUNCHER} = require("../../config/abi-launcher");
const {Univ3} = require("../../utils/univ3");
const {checkTransactionReceipt, encodeFunctionParam} = require("../../utils/evm");
const {getWallet, getGasBalance} = require("./wallet");
const {saveImageFromBase64} = require("../../utils/image");

const _launcherInterface = new ethers.Interface(ABI_LAUNCHER);

const getLauncherProxy = (wallet) => {
    const webProvider = new ethers.JsonRpcProvider(process.env.BSC_RPC_URL);
    const walletProxy = new ethers.Wallet(wallet.pri_key, webProvider);
    return new ethers.Contract(process.env.LAUNCHER_CONTRACT, ABI_LAUNCHER, walletProxy);
}

const newLaunch = async (userId, name, symbol, totalSupply, initCap, initBuy) => {
    const wallet = await getWallet(userId);
    const gasBalance = await getGasBalance(wallet.address);
    if (gasBalance < 0.01) {
        throw new Error("The GAS fee for the wallet is too low, please recharge the GAS fee first.");
    }

    const preData = await apiGet(process.env.LAUNCHER_API + "launch/pre-status", {});
    console.log("preData", preData)
    if (preData.code !== 1) {
        throw new Error("Failed to create information retrieval");
    }

    console.log("preData", preData);
    const proxy = getLauncherProxy(wallet);
    const factory = preData.data.deployer;
    const deployer = "0xd02C189a66B739c150Ea149004ceCa38088AF0cC";
    const salt = preData.data.salt;

    const biTotalSupply = ethers.parseEther(totalSupply + "");
    const biBuy = ethers.parseEther(initBuy + "");

    const createDataParam = [name, symbol, biTotalSupply];
    console.log("createDataParam", createDataParam);
    const createData = encodeFunctionParam("tuple(string, string, uint256)", createDataParam);

    let initPrice = initCap / totalSupply / 640;

    const params = Univ3.getParamsByInitPrice(initPrice, 50, 2500);
    params.tick0 = params.tick0 * 2 + params.tick0Add;
    params.tick1 = params.tick1 * 2 - params.tick1Add;
    //console.log("params", params)

    const deployDataParam = [params.start0Price, params.start1Price, params.tick0, params.tick1, 2500, wallet.address];
    console.log("deployDataParam", deployDataParam)
    const deployData = encodeFunctionParam("tuple(uint160, uint160, int24, int24, uint24, address)", deployDataParam);


    const result = await proxy.newLaunch(factory, deployer, createData, deployData, salt, {value: biBuy});
    await result.wait();
    console.log("result", result.hash)
    const waitResult = await waitEventResult(result.hash, "NewLaunched", (args) => {
        return {
            hash: result.hash,
            token: args[0],
            pool: args[1],
            version: args[2],
            chart: "https://dexscreener.com/bsc/" + args[0],
            swap: "https://pancakeswap.finance/swap?chain=bsc&outputCurrency=" + args[0]
        }
    });
    console.log("waitResult", waitResult)

    return waitResult;
}


const waitEventResult = async (hash, eventName, paramCall) => {
    const result = await checkTransactionReceipt(hash, (logData) => {
        const logResult = _launcherInterface.parseLog(logData);
        if (logResult) {
            if (logResult.name === eventName) {
                //notify.success("logResult.args" + JSON.stringify(logResult.args))
                //uint nftID, uint amount, uint shares, uint startTime
                return paramCall(logResult.args);
            }
        }
        return null;
    })
    return result;
}


module.exports = {newLaunch}