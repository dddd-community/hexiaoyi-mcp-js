const {ethers} = require("ethers")
const {sleep} = require("./tools");

const getWebProvider = () => {
    return new ethers.JsonRpcProvider(process.env.BSC_RPC_URL)
}

const checkTransactionReceipt = async (hash, processCallback) => {

    const proxy = getWebProvider();
    while(true) {
        await sleep(1500);
        const receipt = await proxy.getTransactionReceipt(hash);
        console.log("receipt", receipt);
        if(!receipt) {
            continue;
        }
        if(receipt.status !== 1) {
            console.log("checkTransResult error");
            return "";
        }
        const confirms = await receipt.confirmations();
        console.log("confirms", confirms);
        if(confirms < 4) {
            continue;
        }
        for (let i in receipt.logs) {
            const result = processCallback(receipt.logs[i]);
            if(result) {
                return result;
            }
        }
        return null;
    }
}

const encodeFunctionParam = (type, param) => {
    const abiCoder = new ethers.AbiCoder();
    //const types = ["tuple(address depositToken, uint256 customerRatio, uint256 traderRatio, uint256 depositRatio, uint256 recomDepositRatio, uint256 recomTraderRatio, uint256 mgrRatio, uint256 settleTime)"];
    const types = [type];
    console.log("types", types);
    return abiCoder.encode(types, [param]);
}


module.exports = {checkTransactionReceipt, encodeFunctionParam}