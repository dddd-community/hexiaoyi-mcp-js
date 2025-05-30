const {registerLaunchTools} = require("./tools");

const registerLaunch = (mcpServer) => {
    registerLaunchTools(mcpServer);
}

module.exports = {registerLaunch}