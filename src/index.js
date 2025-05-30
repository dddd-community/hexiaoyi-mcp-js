require('dotenv').config();

const {startSSEServer} = require("./server/sse");
const {startStdioServer} = require("./server/stdio");
const {logger} = require("./utils/logger");
const {initDB} = require("./utils/sqlite");

const args = process.argv.slice(2)
const sseMode = args.includes("--sse") || args.includes("-s")

const main = async () => {

    await initDB();

    let server;
    if(sseMode) {
        server = await startSSEServer();
    } else {
        server = await startStdioServer();
    }

    if(!server) {
        logger.error("Failed to start server")
        process.exit(1)
    }

    const handleShutdown = async () => {
        await server.close()
        process.exit(0)
    }
    // Handle process termination
    process.on("SIGINT", handleShutdown)
    process.on("SIGTERM", handleShutdown)
}

main().catch(e => {
    logger.error("main error", e);
})