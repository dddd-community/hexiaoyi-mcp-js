
const { z } = require("zod");
const {handleSuccess, handleError} = require("../../../utils/helper");


const registerTradeTools = (mcpServer) => {
    mcpServer.tool("buy_dddd_by_amount", "Purchase a specified quantity of DDDD tokens", {
        amount:z.number().positive().describe("Designated DDDD quantity")
    }, async ({amount}) => {
        try {
            //const result = await getDDDDTokenPrice();
            //const result = [{id:1,tweet:"123123"}, {id:2,tweet:"321321"}]
            return handleSuccess({})
        } catch (e) {
            return handleError(e.toString());
        }
    })

    mcpServer.tool("buy_dddd_by_money", "Purchase DDDD tokens of a specified BNB quantity", {
        amount:z.number().positive().describe("Designated BNB quantity")
    }, async ({amount}) => {
        try {
            //const result = await getTokenPriceByAddress(target);
            return handleSuccess({})
        } catch (e) {
            return handleError(e.toString());
        }
    })

    mcpServer.tool("sell_dddd_by_ratio", "Sell a specified percentage of DDDD", {
        ratio:z.number().positive().describe("The specified ratio, 0.5 represents 50%")
    }, async ({ratio}) => {
        try {
            //const result = await getTokenPriceByAddress(target);
            return handleSuccess({})
        } catch (e) {
            return handleError(e.toString());
        }
    })
}

module.exports = {registerTradeTools}