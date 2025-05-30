const sqlite3 = require('sqlite3');

class SQLiteDB {
    constructor(config) {
        this.dbPath = config.path;
        this.readonly = config.readonly || false;
        this.verbose = config.verbose !== undefined ? config.verbose : true;
        this.db = null;
        this.isConnected = false;

        // 绑定进程退出处理
        process.on('SIGINT', () => this.close().catch(console.error));
        process.on('SIGTERM', () => this.close().catch(console.error));
    }

    /**
     * 建立与 SQLite 数据库的连接
     * @returns 返回当前实例
     */
    async connect() {
        if (this.isConnected) return this;

        try {
            const mode = this.readonly
                ? sqlite3.OPEN_READONLY
                : sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE;

            this.db = new (this.verbose ? sqlite3.verbose() : sqlite3).Database(this.dbPath, mode);

            this.isConnected = true;
            if (this.verbose) console.log('成功连接到 SQLite 数据库');
            return this;
        } catch (err) {
            throw new Error(`数据库连接失败: ${err.message}`);
        }
    }

    /**
     * 关闭数据库连接
     */
    async close() {
        if (!this.isConnected || !this.db) return;

        try {
            await new Promise((resolve, reject) => {
                this.db.close((err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
            this.isConnected = false;
            if (this.verbose) console.log('数据库连接已关闭');
        } catch (err) {
            throw new Error(`关闭数据库失败: ${err.message}`);
        }
    }

    /**
     * 确保数据库已连接
     * @private
     */
    async ensureConnected() {
        if (!this.isConnected) {
            await this.connect();
        }
    }

    /**
     * 执行 SQL 语句（适用于 INSERT、UPDATE、DELETE 等）
     * @param sql SQL 语句
     * @param params 参数数组
     * @returns 执行结果
     */
    async run(sql, params = []) {
        await this.ensureConnected();
        try {
            return await new Promise((resolve, reject) => {
                this.db.run(sql, params, function (err) {
                    if (err) {
                        reject(new Error(`执行 SQL 失败: ${err.message}`));
                    } else {
                        resolve({
                            success: true,
                            lastID: this.lastID,
                            changes: this.changes,
                        });
                    }
                });
            });
        } catch (err) {
            throw new Error(`执行 SQL 失败: ${err.message}`);
        }
    }

    /**
     * 查询单行数据
     * @param sql SQL 语句
     * @param params 参数数组
     * @returns 查询结果
     */
    async get(sql, params = []) {
        await this.ensureConnected();
        try {
            return await new Promise((resolve, reject) => {
                this.db.get(sql, params, (err, row) => {
                    if (err) {
                        reject(new Error(`查询单行失败: ${err.message}`));
                    } else {
                        resolve(row);
                    }
                });
            });
        } catch (err) {
            throw new Error(`查询单行失败: ${err.message}`);
        }
    }

    /**
     * 查询多行数据
     * @param sql SQL 语句
     * @param params 参数数组
     * @returns 查询结果数组
     */
    async all(sql, params = []) {
        await this.ensureConnected();
        try {
            return await new Promise((resolve, reject) => {
                this.db.all(sql, params, (err, rows) => {
                    if (err) {
                        reject(new Error(`查询多行失败: ${err.message}`));
                    } else {
                        resolve(rows);
                    }
                });
            });
        } catch (err) {
            throw new Error(`查询多行失败: ${err.message}`);
        }
    }

    /**
     * 执行事务
     * @param operations 操作数组
     * @returns 事务执行结果
     */
    async transaction(operations) {
        await this.ensureConnected();
        try {
            await this.run('BEGIN TRANSACTION');
            for (const { sql, params } of operations) {
                await this.run(sql, params);
            }
            await this.run('COMMIT');
            return { success: true };
        } catch (err) {
            await this.run('ROLLBACK');
            throw new Error(`事务失败: ${err.message}`);
        }
    }

    /**
     * 检查表是否存在
     * @param tableName 表名
     * @returns 是否存在
     */
    async tableExists(tableName) {
        const sql = `
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name=?
    `;
        const result = await this.get(sql, [tableName]);
        return !!result;
    }
}

console.log("process.env.WALLET_DB_PATH", process.env.WALLET_DB_PATH);
// 创建数据库实例
const db = new SQLiteDB({
    path: process.env.WALLET_DB_PATH || "",
    verbose: true,
});

const initDB = async () => {
    if (!await db.tableExists("wallets")) {
        const createTableResult = await db.run(`
            CREATE TABLE wallets (
                 id INTEGER PRIMARY KEY AUTOINCREMENT,
                 address TEXT NOT NULL UNIQUE,
                 user INT default 0,
                 pri_key TEXT,
                 create_at INT default 0
            )
        `);
        console.log("Database init", createTableResult);
    }
};

module.exports = { db, initDB};