
const {registerPrice} = require("./modules/price");
const {registerWallet} = require("./modules/wallet");
const {registerLaunch} = require("./modules/launch");
const {registerTrade} = require("./modules/trade");

const registerBlockchain = (mcpServer) => {
    registerPrice(mcpServer);
    registerWallet(mcpServer);
    registerLaunch(mcpServer);
    //registerTrade(mcpServer);
}

module.exports = {registerBlockchain}