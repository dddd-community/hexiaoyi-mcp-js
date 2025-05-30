require('dotenv').config();
const axios = require('axios');
const { ethers } = require("ethers");

const getTokenPriceByAddress = (target) => {

}

const getDDDDTokenPrice = async () => {
    const abi = [{
        "inputs": [],
        "name": "getBNBPriceInUSDT",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },{
        "inputs": [],
        "name": "getTokenPriceInBNB",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },]

    const webProvider = new ethers.JsonRpcProvider(process.env.BSC_RPC_URL);
    const contract = new ethers.Contract("0x7905395598eD303F4bFD0562d0878f576f82779B", abi, webProvider);
    const result = await Promise.all([contract.getTokenPriceInBNB(), contract.getBNBPriceInUSDT()]);
    const bnbPrice = Number(ethers.formatEther(result[1]));
    const tokenPriceInBNB = Number(ethers.formatEther(result[0]));
    console.log("result", bnbPrice, tokenPriceInBNB)
    const tokenPrice = bnbPrice * tokenPriceInBNB;
    console.log("tokenPrice", tokenPrice);

    return {
        price:tokenPrice,
        priceOnBNB: tokenPriceInBNB,
    }
}



// 查询指定代币价格的函数
async function getTokenPrice(tokenSlug, convertCurrency = 'USD') {
    try {
        // CoinMarketCap API 端点
        const url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest';

        // 发送请求
        const response = await axios.get(url, {
            headers: {
                'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
                'Accept': 'application/json',
            },
            params: {
                slug: tokenSlug, // 代币 slug，例如 'bitcoin', 'ethereum'
                convert: convertCurrency, // 目标货币，例如 'USD', 'CNY'
            },
        });

        // 提取价格数据
        const data = response.data.data;
        const tokenId = Object.keys(data)[0]; // 获取第一个代币的 ID
        const tokenInfo = data[tokenId];

        // 输出结果
        const price = tokenInfo.quote[convertCurrency].price;
        console.log(`代币: ${tokenInfo.name} (${tokenInfo.symbol})`);
        console.log(`价格: ${price.toFixed(2)} ${convertCurrency}`);
        console.log(`更新时间: ${tokenInfo.last_updated}`);

        return {
            name: tokenInfo.name,
            symbol: tokenInfo.symbol,
            price: price,
            currency: convertCurrency,
            last_updated: tokenInfo.last_updated,
        };
    } catch (error) {
        console.error('查询失败:', error.response ? error.response.data : error.message);
        return null;
    }
}

module.exports = {getDDDDTokenPrice, getTokenPriceByAddress}