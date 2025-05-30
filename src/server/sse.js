const {logger} = require("../utils/logger");
const express = require("express");
const cors = require("cors");
const { SSEServerTransport } = require("@modelcontextprotocol/sdk/server/sse.js");
const {startServer} = require("./base");

const startSSEServer = async () => {
    try {

        // Log the current log level on startup
        logger.info(`Starting sse server`)

        const app = express()
        const server = startServer()

        app.use(cors());

        const transports = {};

        app.get("/sse", async (req, res) => {
            const transport = new SSEServerTransport("/messages", res);
            transports[transport.sessionId] = transport;
            logger.info("New SSE connection established", {
                sessionId: transport.sessionId
            })

            res.on("close", () => {
                logger.info("SSE connection closed", { sessionId: transport.sessionId })
                delete transports[transport.sessionId]
            })

            try {
                await server.connect(transport);
            } catch (error) {
                logger.error("Error connecting transport", {
                    sessionId: transport.sessionId,
                    error
                })
            }
        })

        app.post("/messages", async (req, res) => {
            const sessionId = req.query.sessionId;
            const transport = transports[sessionId];

            if (transport) {
                logger.debug("Handling message", { sessionId, body: req.body })
                try {
                    await transport.handlePostMessage(req, res)
                } catch (error) {
                    logger.error("Error handling message", { sessionId, error })
                    res.status(500).send("Internal server error")
                }
            } else {
                logger.warn("No transport found for session", { sessionId })
                res.status(400).send("No transport found for sessionId")
            }
        })

        const PORT = process.env.PORT || 3001
        app.listen(PORT, () => {
            logger.info(
                `BlockChain MCP SSE Server is running on http://localhost:${PORT}`
            )
        })

        return server;

    } catch (e) {
        logger.error("Error starting BlockChain MCP SSE Server:", e)
    }
}

module.exports = {startSSEServer}