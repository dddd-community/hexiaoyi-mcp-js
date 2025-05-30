const { createCipheriv, createDecipheriv, randomBytes } = require('crypto');
const { generateRandomString } = require('./tools');

console.log("process.env.DATA_CRYPTO_KEY", process.env.DATA_CRYPTO_KEY, process.env.DATA_CRYPTO_IV);
if (!process.env.DATA_CRYPTO_KEY || !process.env.DATA_CRYPTO_IV) {
    throw new Error('ENCRYPTION_KEY 或 ENCRYPTION_IV 未设置');
}
if (process.env.DATA_CRYPTO_KEY.length !== 32) {
    throw new Error('ENCRYPTION_KEY 必须是 32 字节');
}
if (process.env.DATA_CRYPTO_IV.length !== 16) {
    throw new Error('ENCRYPTION_IV 必须是 16 字节');
}

// 加解密工具类
class CryptoUtils {
    static key = Buffer.from(process.env.DATA_CRYPTO_KEY);
    static iv = Buffer.from(process.env.DATA_CRYPTO_IV);

    // 加密数据
    static encrypt(text) {
        const cipher = createCipheriv('aes-256-cbc', this.key, this.iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    // 解密数据
    static decrypt(encryptedText) {
        const decipher = createDecipheriv('aes-256-cbc', this.key, this.iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }

    static generateKeyAndIV() {
        const key = generateRandomString(32); // AES-256-CBC 需要 32 字节密钥
        const iv = generateRandomString(16);  // AES-256-CBC 需要 16 字节 IV
        return {
            key, iv
        };
    }
}

module.exports = {CryptoUtils};