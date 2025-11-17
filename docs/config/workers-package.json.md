# Workers API - package.json

**檔案位置**：`workers/api/package.json`

## 完整內容

```json
{
  "name": "debate-api-worker",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy",
    "build": "tsc",
    "test": "vitest"
  },
  "dependencies": {
    "hono": "^4.6.14",
    "@langchain/groq": "^0.1.2",
    "@langchain/langgraph": "^0.2.25",
    "@langchain/core": "^0.3.29"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.20241127.0",
    "@types/node": "^22.10.2",
    "typescript": "^5.7.2",
    "wrangler": "^3.93.0",
    "vitest": "^2.1.8"
  }
}
```

## 套件說明

### Dependencies（生產環境）

| 套件 | 版本 | 用途 |
|------|------|------|
| `hono` | ^4.6.14 | 輕量級 Web 框架（專為 Workers 設計） |
| `@langchain/groq` | ^0.1.2 | Groq API 整合 |
| `@langchain/langgraph` | ^0.2.25 | 多 Agent 流程編排 |
| `@langchain/core` | ^0.3.29 | LangChain 核心功能 |

### DevDependencies（開發環境）

| 套件 | 版本 | 用途 |
|------|------|------|
| `@cloudflare/workers-types` | ^4.20241127.0 | Workers TypeScript 型別定義 |
| `@types/node` | ^22.10.2 | Node.js 型別定義 |
| `typescript` | ^5.7.2 | TypeScript 編譯器 |
| `wrangler` | ^3.93.0 | Cloudflare Workers CLI 工具 |
| `vitest` | ^2.1.8 | 單元測試框架 |

## 安裝指令

```bash
cd workers/api
npm install
```

## 常用指令

```bash
# 本地開發
npm run dev

# 建置
npm run build

# 部署到 Cloudflare
npm run deploy

# 執行測試
npm run test
```

## 注意事項

1. **`"type": "module"`**：使用 ES Modules（Workers 需要）
2. **套件大小**：注意 bundle size 不要超過 3 MB (free) / 10 MB (paid)
3. **相依性管理**：只安裝必要的套件，避免打包過大
