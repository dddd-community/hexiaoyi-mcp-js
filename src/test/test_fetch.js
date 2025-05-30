require('dotenv').config();

const {apiGet} = require("../utils/http");
const test = async () => {
    const preData = await apiGet(process.env.LAUNCHER_API + "launch/pre-status", {});
    console.log("preData", preData)
    if(preData.code !== 1) {
        throw new Error("Failed to create information retrieval");
    }
}

test();