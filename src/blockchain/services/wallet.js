const {db} = require("../../utils/sqlite");
const {ethers} = require("ethers")
const {CryptoUtils} = require("../../utils/crypto")
const {getNow} = require("../../utils/tools");
const {ABI_LAUNCHER} = require("../../config/abi-launcher");


const createWallet = async (userId) => {
    if(userId <= 0) {
        throw new Error("User's ID is incorrect");
    }
    const wallet = await db.get("SELECT address FROM wallets WHERE user=?", [userId]);
    if(wallet) {
        console.log("wallet", wallet);
        throw new Error("The user has already created a wallet," + wallet.address);
    }
    const target = ethers.Wallet.createRandom();
    const insertResult = await db.run(
        "INSERT INTO wallets(user,address,pri_key,create_at) VALUES(?,?,?,?)",
        [userId, target.address, CryptoUtils.encrypt(target.privateKey), getNow()])
    if(!insertResult.success) {
        throw new Error("Create wallet error");
    }

    console.log("insertResult", insertResult)

    return target.address;
}

const getWalletAddress = async (userId) => {
    const wallet = await getWallet(userId);
    return wallet.address;
}

const getGasBalance = async (address) => {
    const webProvider = new ethers.JsonRpcProvider(process.env.BSC_RPC_URL);
    const balance = await webProvider.getBalance(address);
    return Number(ethers.formatEther(balance))
}

const getWallet = async (userId) => {
    if(userId <= 0) {
        throw new Error("User's ID is incorrect");
    }
    const wallet = await db.get("SELECT address,pri_key FROM wallets WHERE user=?", [userId]);
    //console.log("wallet", wallet);
    if(!wallet) {
        throw new Error("You don't have a wallet yet, please create one first");
    }
    wallet.pri_key = CryptoUtils.decrypt(wallet.pri_key);
    //console.log("wallet", wallet);
    return wallet;
}

const withdrawAll = async (receiver, userId) => {
    if(!ethers.isAddress(receiver)) {
        throw new Error("Receiving address error")
    }
    const wallet = await getWallet(userId);
    /*const balance = await getGasBalance(wallet.address);
    if(balance < 0.001) {
        throw new Error("The wallet balance is too low to pay GAS")
    }*/

    const webProvider = new ethers.JsonRpcProvider(process.env.BSC_RPC_URL);
    const walletProvider = new ethers.Wallet(wallet.pri_key, webProvider);

    const balance = await webProvider.getBalance(wallet.address);

    // 获取当前的费用数据
    const feeData = await webProvider.getFeeData();
    // 计算Gas费用
    const gasLimit = ethers.parseUnits('21000', 'wei'); // 标准转账交易的GasLimit
    const gasCost = gasLimit * feeData.gasPrice * 5n;
    console.log("gasCost", gasCost)
    if(balance < gasCost) {
        return "The wallet balance is too low";
    }
    const amountToSend = balance - gasCost;
    console.log("amountToSend", amountToSend);
    const tx = {
        to: receiver,
        value: amountToSend,
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
        maxFeePerGas: feeData.maxFeePerGas,
        gasLimit: gasLimit,
    };
    // 发送交易
    const transactionResponse = await walletProvider.sendTransaction(tx);
    await transactionResponse.wait();
    return {
        hash:transactionResponse.hash
    }
}

module.exports = {getGasBalance, getWallet, getWalletAddress, createWallet, withdrawAll};