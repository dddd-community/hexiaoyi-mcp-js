const { z } = require("zod");
const {handleSuccess, handleError} = require("../../../utils/helper");
const {createWallet, getWalletAddress, getGasBalance, getWallet, withdrawAll} = require("../../services/wallet");

const registerWalletTools = (mcpServer) => {
    mcpServer.tool("create_wallet", "Create a wallet for the current user", {
        extra:z.any().optional().describe("other params")
    }, async ({extra}, context) => {
        try {
            const result = await createWallet(extra.userId)
            return handleSuccess(result)
        } catch (e) {
            return handleError(e.toString());
        }
    })

    mcpServer.tool("get_wallet", "Get the current user's wallet", {
        extra:z.any().optional().describe("other params")
    }, async ({extra}) => {
        try {
            console.log("context","-", extra)
            const result = await getWalletAddress(extra.userId);
            console.log("wallet", result)
            return handleSuccess({wallet:result})
        } catch (e) {
            return handleError(e.toString());
        }
    })

    mcpServer.tool("get_balance", "Get the current wallet balance", {
        extra:z.any().optional().describe("other params")
    }, async ({extra}) => {
        try {
            console.log("context","-", extra)
            const wallet = await getWalletAddress(extra.userId)
            const balance = await getGasBalance(wallet);
            console.log("balance", balance)
            return handleSuccess({balance, symbol:"BNB"})
        } catch (e) {
            return handleError(e.toString());
        }
    })

    mcpServer.tool("transfer_dddd", "Transfer dddd tokens to the designated address", {
        target:z.string().describe("Receive DDDD token address"),
        extra:z.any().optional().describe("other params")
    }, async ({target, extra}) => {
        try {
            console.log("context","-", extra)
            //const wallet = await getWalletAddress(extra.userId)
            //const balance = await getGasBalance(wallet);
            //console.log("balance", balance)
            return handleSuccess({})
        } catch (e) {
            return handleError(e.toString());
        }
    })

    mcpServer.tool("withdraw_all_bnb", "Withdraw all BNBs from the current wallet", {
        target:z.string().describe("Receive BNB token address"),
        extra:z.any().optional().describe("other params")
    }, async ({target, extra}) => {
        try {
            console.log("context","-", extra)
            const result = await withdrawAll(target, extra.userId)
            return handleSuccess(result)
        } catch (e) {
            return handleError(e.toString());
        }
    })


}

module.exports = {registerWalletTools}