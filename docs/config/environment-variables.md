# 環境變數設定指南

## 概覽

本專案使用兩套環境變數系統：
1. **前端（Next.js）**：`.env.local`
2. **後端（Workers）**：`.dev.vars`（本地）+ Secrets（生產）

---

## 前端環境變數

### 檔案位置

- **範本**：`.env.local.example`
- **實際**：`.env.local`（需要自己建立）

### 內容

```bash
# ========================================
# 環境變數範本
# ========================================
# 複製此檔案為 .env.local 並填入實際值

# === 前端設定 ===
# Workers API 網址（本地開發會自動用 localhost:8787）
NEXT_PUBLIC_API_URL=http://localhost:8787

# === Workers 設定（在 workers/api/.dev.vars 設定）===
# 請到 workers/api/ 目錄下建立 .dev.vars 檔案：
# GROQ_API_KEY=gsk_xxxxx
# OPENROUTER_API_KEY=sk-or-xxxxx

# === Groq API ===
# 申請網址：https://console.groq.com/keys
# GROQ_API_KEY=gsk_xxxxxxxxxxxxx

# === OpenRouter API（可選）===
# 申請網址：https://openrouter.ai/keys
# OPENROUTER_API_KEY=sk-or-xxxxxxxxxxxxx

# === 部署後的生產環境變數 ===
# 生產環境的 Secrets 用 wrangler secret put 設定：
# wrangler secret put GROQ_API_KEY
# wrangler secret put OPENROUTER_API_KEY
```

### 設定步驟

```bash
# 1. 複製範本
cp .env.local.example .env.local

# 2. 本地開發不需要修改（使用預設值即可）

# 3. 部署時需要在 Cloudflare Pages Dashboard 設定：
#    NEXT_PUBLIC_API_URL = https://debate-api.your-account.workers.dev
```

---

## Workers 環境變數

### 本地開發（.dev.vars）

#### 檔案位置
- **範本**：`workers/api/.dev.vars.example`
- **實際**：`workers/api/.dev.vars`（需要自己建立）

#### 內容

```bash
# Workers 本地開發環境變數
# 複製此檔案為 .dev.vars 並填入實際值
# wrangler dev 會自動載入 .dev.vars

GROQ_API_KEY=gsk_xxxxxxxxxxxxx
OPENROUTER_API_KEY=sk-or-xxxxxxxxxxxxx
```

#### 設定步驟

```bash
# 1. 進入 workers/api 目錄
cd workers/api

# 2. 複製範本
cp .dev.vars.example .dev.vars

# 3. 編輯 .dev.vars，填入你的 API Keys
# vim .dev.vars
# 或
# code .dev.vars
```

---

### 生產環境（Secrets）

#### 為什麼不用 .dev.vars？

- `.dev.vars` 只在本地開發有效
- 生產環境需要用 `wrangler secret put` 設定
- Secrets 會加密儲存在 Cloudflare

#### 設定步驟

```bash
# 1. 進入 workers/api 目錄
cd workers/api

# 2. 設定 Groq API Key
wrangler secret put GROQ_API_KEY
# 會要求你輸入 API Key（不會顯示在畫面上）

# 3. 設定 OpenRouter API Key（可選）
wrangler secret put OPENROUTER_API_KEY

# 4. 查看已設定的 Secrets
wrangler secret list

# 5. 刪除 Secret
wrangler secret delete GROQ_API_KEY
```

---

## API Keys 申請

### Groq API Key（必要）

**申請步驟**：

1. 前往 https://console.groq.com/keys
2. 註冊/登入帳號
3. 點選「Create API Key」
4. 命名（例如：`debate-platform-dev`）
5. 複製 API Key（格式：`gsk_xxxxxxxxxxxxx`）
6. 貼到 `workers/api/.dev.vars` 的 `GROQ_API_KEY`

**免費額度**：
- 6,000 tokens/分鐘
- ~500,000 tokens/天（社群回報）

**推薦模型**：
- `llama-3.1-8b-instant`（速度快，適合辯論）
- `mixtral-8x7b-32768`（上下文長，適合總結）

---

### OpenRouter API Key（可選）

**申請步驟**：

1. 前往 https://openrouter.ai/keys
2. 註冊/登入帳號
3. 點選「Create Key」
4. 複製 API Key（格式：`sk-or-xxxxxxxxxxxxx`）
5. 貼到 `workers/api/.dev.vars` 的 `OPENROUTER_API_KEY`

**免費額度（2025 限制）**：
- 20 requests/分鐘
- 50 requests/天
- **需要有 $10+ 餘額才能解鎖 1000 requests/天**

**何時使用**：
- Groq 達到限額時的備援
- 需要使用 Groq 沒有的模型
- 測試不同模型的回應品質

---

## 環境變數在程式碼中的使用

### 前端（Next.js）

```typescript
// Client Component
'use client';

export default function Page() {
  // ✅ 可以使用（NEXT_PUBLIC_ 開頭）
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // ❌ 無法使用（沒有 NEXT_PUBLIC_ 開頭）
  // const secret = process.env.GROQ_API_KEY; // undefined
}
```

```typescript
// Server Component
export default async function Page() {
  // ✅ 兩者都可以使用
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const secret = process.env.GROQ_API_KEY;
}
```

---

### 後端（Workers）

```typescript
// workers/api/src/index.ts
export interface Env {
  GROQ_API_KEY: string;
  OPENROUTER_API_KEY?: string;
  KV?: KVNamespace; // Phase 3
  DB?: D1Database;  // Phase 3
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    // ✅ 透過 env 參數存取
    const apiKey = env.GROQ_API_KEY;

    // ❌ 無法使用 process.env
    // const apiKey = process.env.GROQ_API_KEY; // undefined
  }
};
```

---

## 安全性最佳實踐

### ✅ 應該做的

1. **永遠不要提交 `.env.local` 和 `.dev.vars`**
   - 已加入 `.gitignore`
   - 檢查：`git status` 不應看到這些檔案

2. **使用 Secrets 而非環境變數**
   - 生產環境用 `wrangler secret put`
   - 不要把 API Key 寫在 `wrangler.toml`

3. **定期更換 API Keys**
   - 每 3-6 個月更換一次
   - 洩漏後立即更換

4. **限制 API Key 權限**
   - 只給予必要的權限
   - 使用 IP 白名單（如果服務支援）

### ❌ 不應該做的

1. **不要在前端暴露機密 API Keys**
   ```typescript
   // ❌ 錯誤：API Key 會暴露給瀏覽器
   const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

   // ✅ 正確：API Key 只在後端使用
   // 前端透過 Workers API 間接呼叫
   ```

2. **不要在公開 repo 提交 API Keys**
   - 即使是測試用的 Key 也不要
   - GitHub 會掃描並自動撤銷洩漏的 Keys

3. **不要在 client-side 程式碼直接呼叫 LLM API**
   ```typescript
   // ❌ 錯誤
   fetch('https://api.groq.com/v1/chat', {
     headers: { 'Authorization': `Bearer ${API_KEY}` }
   });

   // ✅ 正確
   fetch('/api/debate', { method: 'POST', body: JSON.stringify({ topic }) });
   ```

---

## 除錯技巧

### 檢查環境變數是否載入

**前端**：
```typescript
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
```

**Workers**：
```typescript
export default {
  async fetch(request: Request, env: Env) {
    console.log('Has Groq Key:', !!env.GROQ_API_KEY);
    console.log('Key length:', env.GROQ_API_KEY?.length);
    // 不要 console.log 完整的 Key！
  }
};
```

### 常見錯誤排查

**錯誤**：`env.GROQ_API_KEY is undefined`

**原因**：
1. `.dev.vars` 檔案不存在或內容錯誤
2. 生產環境忘記設定 Secret
3. `wrangler.toml` 的 `name` 改了但 Secret 還是綁在舊名稱

**解決**：
```bash
# 本地開發
cd workers/api
cat .dev.vars  # 檢查內容

# 生產環境
wrangler secret list
wrangler secret put GROQ_API_KEY
```

---

## 總結

| 環境 | 前端 | Workers 本地 | Workers 生產 |
|------|------|-------------|-------------|
| 檔案 | `.env.local` | `.dev.vars` | Secrets |
| 設定方式 | 手動編輯 | 手動編輯 | `wrangler secret put` |
| 存取方式 | `process.env.NEXT_PUBLIC_*` | `env.*` | `env.*` |
| 提交 Git | ❌ | ❌ | N/A |
| 範本檔案 | `.env.local.example` | `.dev.vars.example` | N/A |
