const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const {logger} = require("../utils/logger");
const {registerFetch} = require("../fetch");
const {registerBlockchain} = require("../blockchain");


const startServer = () => {
    try {
        const server = new McpServer({
            name: "Hexiaoyi MCP Server",
            version: "1.0.0"
        });

        registerFetch(server);
        registerBlockchain(server);
        return server;
    } catch (e) {
        logger.error("Failed to initialize server:", e)
        process.exit(1);
    }
}

module.exports = {startServer}