
const { z } = require("zod");
const {handleSuccess, handleError} = require("../../../utils/helper");
const {getDDDDTokenPrice, getTokenPriceByAddress} = require("../../services/price");
const {newLaunch} = require("../../services/launch");


const registerLaunchTools = (mcpServer) => {
    mcpServer.tool("launch_token", "Create and launch a token", {
        name:z.string().describe("token name"),
        symbol:z.string().describe("token symbol"),
        totalSupply:z.number().positive().describe("total amount of tokens"),
        extra:z.any().optional().describe("other params")
    }, async ({name, symbol, totalSupply, extra}) => {
        try {
            console.log("launch_token", name, symbol, totalSupply, extra);
            const result = await newLaunch(extra.userId, name, symbol, totalSupply, 36000, 0);
            //const result = await getDDDDTokenPrice();
            //const result = [{id:1,tweet:"123123"}, {id:2,tweet:"321321"}]
            return handleSuccess(result)
        } catch (e) {
            return handleError(e.toString());
        }
    })
}

module.exports = {registerLaunchTools}