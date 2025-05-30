const {randomBytes} = require('crypto');

const getNow = () => {
    return Math.floor(new Date().getTime() / 1000);
}

const generateRandomString = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const bytes = randomBytes(length);
    for (let i = 0; i < length; i++) {
        result += chars[bytes[i] % chars.length];
    }
    return result;
}

const sleep = async (time) => {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}

module.exports = {getNow, generateRandomString, sleep}