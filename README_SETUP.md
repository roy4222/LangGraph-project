# 專案設定指南

> 💡 **詳細的配置文件說明請參考** [docs/config/](docs/config/README.md)

## 📋 前置準備

### 1. 安裝相依套件

#### 前端（Next.js）
```bash
npm install
```

#### 後端（Cloudflare Workers）
```bash
cd workers/api
npm install
cd ../..
```

### 2. 設定環境變數

#### 前端環境變數
```bash
# 複製範本
cp .env.local.example .env.local

# 編輯 .env.local（開發時不需要改，用預設值即可）
# NEXT_PUBLIC_API_URL=http://localhost:8787
```

#### Workers 環境變數
```bash
# 進入 workers/api 目錄
cd workers/api

# 複製範本
cp .dev.vars.example .dev.vars

# 編輯 .dev.vars，填入你的 API Keys
# GROQ_API_KEY=gsk_xxxxxxxxxxxxx
# OPENROUTER_API_KEY=sk-or-xxxxxxxxxxxxx（可選）
```

#### 取得 API Keys

**Groq API Key**（必要）：
1. 前往 https://console.groq.com/keys
2. 註冊/登入帳號
3. 建立新的 API Key
4. 複製並貼到 `.dev.vars` 的 `GROQ_API_KEY`

**OpenRouter API Key**（可選）：
1. 前往 https://openrouter.ai/keys
2. 註冊/登入帳號
3. 建立新的 API Key
4. 複製並貼到 `.dev.vars` 的 `OPENROUTER_API_KEY`

---

## 🚀 本地開發

### 方法一：分別啟動（推薦，方便除錯）

開兩個終端視窗：

**終端 1：啟動 Workers**
```bash
cd workers/api
npm run dev
# Workers 會運行在 http://localhost:8787
```

**終端 2：啟動 Next.js**
```bash
npm run dev
# 前端會運行在 http://localhost:3000
```

### 方法二：同時啟動
```bash
npm run dev:all
```

---

## 🧪 測試設定

### 測試 Workers 是否正常運行

Workers 啟動後，開啟瀏覽器訪問：
```
http://localhost:8787/api/health
```

應該會看到：
```json
{"status":"ok","timestamp":1234567890}
```

### 測試前端是否能連接到 Workers

前端啟動後，訪問：
```
http://localhost:3000/test-sse
```

應該會看到 SSE 測試頁面。

---

## 📦 建置與部署

### 本地建置測試

```bash
# 建置前端
npm run build

# 建置 Workers
npm run build:worker
```

### 部署到 Cloudflare

#### 首次部署前準備

1. **安裝 Wrangler CLI**（如果尚未安裝）
```bash
npm install -g wrangler
```

2. **登入 Cloudflare**
```bash
wrangler login
```

3. **設定生產環境的 Secrets**
```bash
cd workers/api
wrangler secret put GROQ_API_KEY
# 輸入你的 Groq API Key

wrangler secret put OPENROUTER_API_KEY
# 輸入你的 OpenRouter API Key（可選）
```

#### 部署 Workers
```bash
npm run deploy:worker
```

部署成功後會顯示：
```
Published debate-api
  https://debate-api.your-account.workers.dev
```

#### 部署 Next.js 到 Cloudflare Pages

**方法一：透過 Git 連接（推薦）**
1. 將專案推送到 GitHub
2. 前往 Cloudflare Dashboard > Pages
3. 點選「Create a project」> 「Connect to Git」
4. 選擇你的 repo
5. 建置設定：
   - Build command: `npm run build`
   - Build output directory: `.next`
6. 環境變數：
   - `NEXT_PUBLIC_API_URL`: `https://debate-api.your-account.workers.dev`

**方法二：手動部署**
```bash
npm run build
wrangler pages deploy .next --project-name=debate-platform
```

---

## 🗂️ 專案結構

```
/langgraph
├── app/                       # Next.js 16 前端
│   ├── debate/               # 辯論相關頁面
│   ├── test-sse/             # SSE 測試頁面
│   └── ...
├── workers/
│   └── api/                  # Cloudflare Workers 後端
│       ├── src/
│       │   ├── index.ts      # Hono app 入口
│       │   ├── routes/       # API 路由
│       │   └── lib/          # 工具函式、Agent 邏輯
│       ├── wrangler.toml     # Workers 設定
│       ├── package.json
│       ├── tsconfig.json
│       └── .dev.vars         # 本地環境變數（不提交）
├── .env.local.example        # 前端環境變數範本
├── .env.local                # 前端環境變數（不提交）
├── next.config.ts            # Next.js 設定
├── package.json              # 前端套件
├── README.md                 # 專案說明
└── README_SETUP.md           # 本檔案
```

---

## ⚙️ 設定檔說明

### `next.config.ts`
- 設定 API 路由代理（本地開發時 `/api/*` 會轉到 `localhost:8787`）
- CORS 設定

### `wrangler.toml`
- Workers 名稱、主檔案、相容性設定
- CPU 時間限制（設為 5 分鐘，足夠跑完辯論）
- KV/D1 綁定（Phase 3 才會用到）

### `workers/api/tsconfig.json`
- TypeScript 設定（Workers 專用）
- 引入 `@cloudflare/workers-types` 型別

---

## 🐛 常見問題

### Q: Workers 啟動時出現 `Cannot find module 'hono'`
```bash
cd workers/api
npm install
```

### Q: 前端無法連接到 Workers（CORS 錯誤）
確認：
1. Workers 是否正常運行（訪問 `http://localhost:8787/api/health`）
2. `next.config.ts` 的 `rewrites` 設定是否正確
3. Workers 的 CORS 設定是否啟用

### Q: Groq API 回應 401 Unauthorized
檢查：
1. `.dev.vars` 的 `GROQ_API_KEY` 是否正確
2. API Key 是否有效（到 Groq Console 確認）

### Q: `wrangler login` 失敗
嘗試：
```bash
wrangler logout
wrangler login
```

---

## 📚 延伸閱讀

- [Cloudflare Workers 文件](https://developers.cloudflare.com/workers/)
- [Hono 文件](https://hono.dev/)
- [LangGraph.js 文件](https://langchain-ai.github.io/langgraphjs/)
- [Groq API 文件](https://console.groq.com/docs)
