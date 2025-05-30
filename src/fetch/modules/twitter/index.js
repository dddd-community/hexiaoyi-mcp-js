const {registerTwitterTools} = require("./tools");

const registerTwitter = (mcpServer) => {
    registerTwitterTools(mcpServer);
}

module.exports = {registerTwitter}