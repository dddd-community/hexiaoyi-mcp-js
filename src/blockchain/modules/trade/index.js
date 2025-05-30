const {registerTradeTools} = require("./tools");

const registerTrade = (mcpServer) => {
    registerTradeTools(mcpServer);
}

module.exports = {registerTrade}