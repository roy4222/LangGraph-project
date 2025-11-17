# Wrangler 配置文件

**檔案位置**：`workers/api/wrangler.toml`

## 完整內容

```toml
# Cloudflare Workers 設定檔
# 文件：https://developers.cloudflare.com/workers/wrangler/configuration/

name = "debate-api"
main = "src/index.ts"
compatibility_date = "2024-09-23"

# Node.js 相容性（LangChain 需要）
compatibility_flags = ["nodejs_compat"]

# 開發設定
[dev]
port = 8787
local_protocol = "http"

# 環境變數（非機密資料）
[vars]
ENV = "development"

# === Secrets（機密資料，用 wrangler secret put 設定）===
# 使用指令設定：
# wrangler secret put GROQ_API_KEY
# wrangler secret put OPENROUTER_API_KEY

# === Cloudflare KV（Phase 3 才需要）===
# [[kv_namespaces]]
# binding = "KV"
# id = "your_kv_namespace_id"

# === Cloudflare D1（Phase 3 才需要）===
# [[d1_databases]]
# binding = "DB"
# database_name = "debate-db"
# database_id = "your_database_id"

# === Durable Objects（進階功能才需要）===
# [[durable_objects.bindings]]
# name = "DEBATE_STATE"
# class_name = "DebateState"
# script_name = "debate-api"

# === 限制設定 ===
# Workers 預設限制：
# - CPU time: 30 秒（可設定到 300,000 ms）
# - Memory: 128 MB（無法調整）
# - Script size: 3 MB (free) / 10 MB (paid)

[limits]
cpu_ms = 300000  # 5 分鐘（辯論可能需要較長時間）
```

## 設定說明

### 基本設定

| 欄位 | 值 | 說明 |
|------|-----|------|
| `name` | `debate-api` | Worker 名稱（部署後的 URL 會包含此名稱） |
| `main` | `src/index.ts` | 入口檔案 |
| `compatibility_date` | `2024-09-23` | 相容性日期（LangGraph.js 最低需求） |

### 相容性設定

```toml
compatibility_flags = ["nodejs_compat"]
```

- **nodejs_compat**：啟用 Node.js API 相容層
- LangChain/LangGraph 需要此設定才能運行

### 開發設定

```toml
[dev]
port = 8787
local_protocol = "http"
```

- 本地開發伺服器會運行在 `http://localhost:8787`
- 與 Next.js (`localhost:3000`) 不衝突

### 環境變數 vs Secrets

**環境變數（`[vars]`）**：
- 非機密資料
- 直接寫在 `wrangler.toml`
- 例如：`ENV = "development"`

**Secrets（機密資料）**：
- API Keys、密碼等敏感資訊
- **不要**寫在 `wrangler.toml`
- 用指令設定：
  ```bash
  wrangler secret put GROQ_API_KEY
  # 會要求你輸入 API Key
  ```

### 資源限制

```toml
[limits]
cpu_ms = 300000  # 5 分鐘
```

- **預設**：30 秒
- **最大**：300,000 ms (5 分鐘)
- **用途**：辯論流程可能需要多次 LLM 呼叫，需要較長時間

## Phase 3 才需要的設定

### Cloudflare KV（鍵值儲存）

```toml
[[kv_namespaces]]
binding = "KV"
id = "your_kv_namespace_id"
```

**建立 KV Namespace**：
```bash
wrangler kv:namespace create "KV"
# 會返回 namespace ID，填入 id 欄位
```

### Cloudflare D1（SQL 資料庫）

```toml
[[d1_databases]]
binding = "DB"
database_name = "debate-db"
database_id = "your_database_id"
```

**建立 D1 資料庫**：
```bash
wrangler d1 create debate-db
# 會返回 database ID，填入 database_id 欄位
```

## 常見問題

### Q: 如何更改 Worker 名稱？
修改 `name` 欄位，重新部署即可。

### Q: 如何查看已設定的 Secrets？
```bash
wrangler secret list
```

### Q: 如何刪除 Secret？
```bash
wrangler secret delete GROQ_API_KEY
```

### Q: 本地開發時如何使用 Secrets？
建立 `.dev.vars` 檔案（參考 `.dev.vars.example`）
