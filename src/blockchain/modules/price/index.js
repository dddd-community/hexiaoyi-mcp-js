const {registerPriceTools} = require("./tools");

const registerPrice = (mcpServer) => {
    registerPriceTools(mcpServer);
}

module.exports = {registerPrice}