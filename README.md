# Hexiaoyi MCP

一个强大的工具包，用于通过自然语言处理和人工智能辅助与EVM兼容网络进行交互。

## Description

Hexiaoyi MCP是一种模型上下文协议实现，通过人工智能接口实现与区块链网络的无缝交互。它为区块链开发、智能合约交互和网络管理提供了一套全面的工具和资源。

## 核心模块

该项目分为几个核心模块：

- **Blockchain**: 管理钱包，发射代币，查询余额，交易代币
- **Fetch**: 获取第三方平台数据，如查询推特推文等
- 其他更多功能，敬请期待 (如头像生成，梗文化文字等)


默认模式

```json
{
  "mcpServers": {
    "hexiaoyi-mcp": {
      "command": "node",
      "args": ["-y", "@dddd-community/hexiaoyi-mcp-js@latest"],
      "env": {
        "TWITTER_APP_KEY": "",
        "TWITTER_APP_SECRET": "",
        "TWITTER_ACCESS_TOKEN": "",
        "TWITTER_ACCESS_SECRET": "",
        "TWITTER_BEARER": "",
        "HTTP_PROXY_URL": "",
        "WALLET_DB_PATH": "",
        "BSC_RPC_URL": "",
        "DATA_CRYPTO_KEY": "",
        "DATA_CRYPTO_IV": "",
        "LAUNCHER_CONTRACT": "",
        "LAUNCHER_API": "",
        "RES_PATH": ""
      }
    }
  }
}
```

SSE 模式

```json
{
  "mcpServers": {
    "hexiaoyi-mcp": {
      "command": "npx",
      "args": ["-y", "@dddd-community/hexiaoyi-mcp-js@latest", "--sse"],
      "env": {
        "TWITTER_APP_KEY": "",
        "TWITTER_APP_SECRET": "",
        "TWITTER_ACCESS_TOKEN": "",
        "TWITTER_ACCESS_SECRET": "",
        "TWITTER_BEARER": "",
        "HTTP_PROXY_URL": "",
        "WALLET_DB_PATH": "",
        "BSC_RPC_URL": "",
        "DATA_CRYPTO_KEY": "",
        "DATA_CRYPTO_IV": "",
        "LAUNCHER_CONTRACT": "",
        "LAUNCHER_API": "",
        "RES_PATH": ""
      }
    }
  }
}
```

## 可用提示和工具

### 提示语 Prompts

| 名称  | 描述  |
|-----|-----|
|     |     |

### 工具集合 Tools

| 名称                         | 描述                                                                           |
|----------------------------|------------------------------------------------------------------------------|
| get_wallet                 | 得到当前用户的钱包                                                                    |
| create_wallet              | 给当前用户创建一个钱包                                                                  |
| get_balance                | 查询当前钱包余额                                                                     |
| transfer_dddd              | 转移DDDD代币                                                                     |
| withdraw_all_bnb           | 提取所有BNB                                                                      |
| launch_token               | 发布一个新的代币                                                                     |
| get_dddd_price             | 获取DDDD的价格                                                                    |
| get_token_price_by_address | 获取指定代币的价格                                                                    |
| buy_dddd_by_amount         | 买入指定数量的DDDD代币                                                                |
| buy_dddd_by_money          | 买入指定BNB数量的DDDD代币                                                             |
| sell_dddd_by_ratio         | 卖出指定百分比的DDDD代币                                                               |
| search_hot_tweets          | 查询热们推文                                                                       |

## 支持网络

支持 BSC Chain.

## 参考文献和致谢

本项目基于以下开源项目并受到其启发：

- [bnb-chain/bnbchain-mcp](https://github.com/bnb-chain/bnbchain-mcp) - BNB Chain MCP

我们感谢原作者对区块链生态系统的贡献。