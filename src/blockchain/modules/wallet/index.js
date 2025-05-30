const {registerWalletTools} = require("./tools");

const registerWallet = (mcpServer) => {
    registerWalletTools(mcpServer);
}

module.exports = {registerWallet}