
const { z } = require("zod");
const {searchHotsTweets} = require("../../services/twitter");
const {handleSuccess, handleError} = require("../../../utils/helper");


const registerTwitterTools = (mcpServer) => {
    mcpServer.tool("search_hot_tweets", "Search for popular Twitter posts", {key:z.string().describe("search key")}, async ({key}) => {
        try {
            console.log("key", key);
            const result = await searchHotsTweets(key, 10);
            //const result = [{id:1,tweet:"123123"}, {id:2,tweet:"321321"}]
            return handleSuccess({tweets:result})
        } catch (e) {
            return handleError(e.toString());
        }
    })
}

module.exports = {registerTwitterTools}