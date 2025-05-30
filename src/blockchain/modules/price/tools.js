
const { z } = require("zod");
const {handleSuccess, handleError} = require("../../../utils/helper");
const {getDDDDTokenPrice, getTokenPriceByAddress} = require("../../services/price");


const registerPriceTools = (mcpServer) => {
    mcpServer.tool("get_dddd_price", "Get the price of dddd token", {}, async () => {
        try {
            const result = await getDDDDTokenPrice();
            //const result = [{id:1,tweet:"123123"}, {id:2,tweet:"321321"}]
            return handleSuccess(result)
        } catch (e) {
            return handleError(e.toString());
        }
    })

    mcpServer.tool("get_token_price_by_address", "Query token prices by specifying the contract address", {
        target:z.string().describe("Token contract address")
    }, async ({target}) => {
        try {
            const result = await getTokenPriceByAddress(target);
            return handleSuccess(result)
        } catch (e) {
            return handleError(e.toString());
        }
    })
}

module.exports = {registerPriceTools}