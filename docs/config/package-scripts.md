# NPM Scripts 使用指南

## 根目錄 package.json Scripts

### 開發指令

#### `npm run dev`
**用途**：啟動 Next.js 開發伺服器

```bash
npm run dev
```

- 啟動位置：`http://localhost:3000`
- 熱重載（Hot Reload）
- 只啟動前端，不啟動 Workers

---

#### `npm run dev:worker`
**用途**：啟動 Cloudflare Workers 開發伺服器

```bash
npm run dev:worker
```

- 啟動位置：`http://localhost:8787`
- 等同於 `cd workers/api && npm run dev`
- 自動載入 `.dev.vars` 環境變數

---

#### `npm run dev:all`
**用途**：同時啟動前端和 Workers

```bash
npm run dev:all
```

- 前端：`http://localhost:3000`
- Workers：`http://localhost:8787`
- 兩個服務並行執行

**注意**：
- 使用 `&` 並行執行（Unix/Mac）
- Windows 需要改用 `concurrently` 或手動開兩個終端

**替代方案（Windows）**：
```json
"dev:all": "concurrently \"npm run dev\" \"npm run dev:worker\""
```
需要安裝：
```bash
npm install -D concurrently
```

---

### 建置指令

#### `npm run build`
**用途**：建置 Next.js 前端

```bash
npm run build
```

- 輸出目錄：`.next/`
- 適合部署到 Cloudflare Pages 或 Vercel

---

#### `npm run build:worker`
**用途**：建置 Workers（TypeScript 編譯）

```bash
npm run build:worker
```

- 等同於 `cd workers/api && npm run build`
- 輸出目錄：`workers/api/dist/`
- 執行 `tsc` 編譯

---

#### `npm run build:all`
**用途**：同時建置前端和 Workers

```bash
npm run build:all
```

- 先建置 Next.js
- 再建置 Workers
- 適合 CI/CD 流程

---

### 啟動指令

#### `npm run start`
**用途**：啟動建置後的 Next.js（生產模式）

```bash
npm run build
npm run start
```

- 啟動位置：`http://localhost:3000`
- 使用建置後的 `.next/` 檔案
- 不會啟動 Workers

---

### 程式碼品質

#### `npm run lint`
**用途**：執行 ESLint 檢查

```bash
npm run lint
```

- 檢查前端程式碼
- 不檢查 Workers（Workers 有自己的 lint）

---

### 部署指令

#### `npm run deploy`
**用途**：部署 Next.js 到 Cloudflare Pages

```bash
npm run deploy
```

- 自動執行 `npm run build`
- 使用 `wrangler pages deploy .next`
- 需要先登入：`wrangler login`

**首次部署**：
```bash
npm run deploy
# 會要求你設定專案名稱
```

**後續部署**：
```bash
npm run deploy
# 自動部署到已存在的專案
```

---

#### `npm run deploy:worker`
**用途**：部署 Workers 到 Cloudflare

```bash
npm run deploy:worker
```

- 等同於 `cd workers/api && npm run deploy`
- 使用 `wrangler.toml` 的設定
- 需要先登入：`wrangler login`

---

## Workers API package.json Scripts

**位置**：`workers/api/package.json`

### `npm run dev`（在 workers/api 目錄下）

```bash
cd workers/api
npm run dev
```

- 執行 `wrangler dev`
- 啟動位置：`http://localhost:8787`
- 自動載入 `.dev.vars`

---

### `npm run build`（在 workers/api 目錄下）

```bash
cd workers/api
npm run build
```

- 執行 `tsc`（TypeScript 編譯）
- 輸出到 `dist/`

---

### `npm run deploy`（在 workers/api 目錄下）

```bash
cd workers/api
npm run deploy
```

- 執行 `wrangler deploy`
- 部署到 Cloudflare Workers
- 使用 `wrangler.toml` 的設定

---

### `npm run test`（在 workers/api 目錄下）

```bash
cd workers/api
npm run test
```

- 執行 `vitest`
- 單元測試框架

---

## 完整開發工作流程

### 本地開發（推薦）

**終端 1：Workers**
```bash
cd workers/api
npm run dev
```

**終端 2：Next.js**
```bash
npm run dev
```

**瀏覽器**：
- 前端：http://localhost:3000
- Workers API：http://localhost:8787

---

### 本地開發（簡化版）

**單一終端**
```bash
npm run dev:all
```

**瀏覽器**：
- 前端：http://localhost:3000
- Workers API：http://localhost:8787

---

### 首次部署

**1. 登入 Cloudflare**
```bash
wrangler login
```

**2. 設定 Workers Secrets**
```bash
cd workers/api
wrangler secret put GROQ_API_KEY
# 輸入你的 Groq API Key
```

**3. 部署 Workers**
```bash
npm run deploy:worker
# 記下部署後的 URL，例如：
# https://debate-api.your-account.workers.dev
```

**4. 設定前端環境變數**
在 Cloudflare Pages Dashboard 設定：
- `NEXT_PUBLIC_API_URL` = `https://debate-api.your-account.workers.dev`

**5. 部署前端**
```bash
npm run deploy
```

---

### 後續部署

**更新 Workers**
```bash
npm run deploy:worker
```

**更新前端**
```bash
npm run deploy
```

**同時更新**
```bash
npm run build:all
npm run deploy:worker
npm run deploy
```

---

## 常用指令組合

### 完整測試流程

```bash
# 1. 檢查程式碼品質
npm run lint

# 2. 建置測試
npm run build:all

# 3. 本地測試
npm run dev:all

# 4. Workers 單元測試
cd workers/api && npm run test

# 5. 部署
npm run deploy:worker
npm run deploy
```

---

### 快速重啟

```bash
# 重啟 Workers（在 workers/api 目錄下）
# Ctrl+C 停止
npm run dev

# 重啟 Next.js（在根目錄）
# Ctrl+C 停止
npm run dev
```

---

### 清理建置檔案

```bash
# 清理 Next.js 建置
rm -rf .next

# 清理 Workers 建置
rm -rf workers/api/dist
rm -rf workers/api/.wrangler

# 清理 node_modules（完全重裝）
rm -rf node_modules workers/api/node_modules
npm install
cd workers/api && npm install
```

---

## 自訂 Scripts

### 新增 lint:fix

**根目錄 package.json**：
```json
"scripts": {
  "lint": "eslint",
  "lint:fix": "eslint --fix"
}
```

**使用**：
```bash
npm run lint:fix
```

---

### 新增 test（前端）

```json
"scripts": {
  "test": "vitest",
  "test:watch": "vitest --watch"
}
```

**安裝**：
```bash
npm install -D vitest @vitejs/plugin-react
```

---

### 新增 clean

```json
"scripts": {
  "clean": "rm -rf .next workers/api/dist workers/api/.wrangler",
  "clean:all": "npm run clean && rm -rf node_modules workers/api/node_modules"
}
```

**使用**：
```bash
npm run clean
npm run clean:all && npm install && cd workers/api && npm install
```

---

## 常見問題

### Q: `npm run dev:all` 在 Windows 無法執行

**原因**：Windows 不支援 `&` 並行指令

**解決**：
```bash
# 方法一：使用 concurrently
npm install -D concurrently

# 修改 package.json
"dev:all": "concurrently \"npm run dev\" \"npm run dev:worker\""

# 方法二：手動開兩個終端
# 終端 1
npm run dev

# 終端 2
npm run dev:worker
```

---

### Q: `npm run deploy` 失敗

**檢查**：
1. 是否已登入？`wrangler login`
2. 是否已建置？`npm run build`
3. 是否有權限？檢查 Cloudflare Dashboard

---

### Q: 如何查看部署後的 Workers URL？

```bash
cd workers/api
wrangler deployments list
```

或查看部署輸出：
```
Published debate-api
  https://debate-api.your-account.workers.dev
```

---

## 總結

| 指令 | 用途 | 位置 |
|------|------|------|
| `npm run dev` | 啟動 Next.js | 根目錄 |
| `npm run dev:worker` | 啟動 Workers | 根目錄 |
| `npm run dev:all` | 啟動前後端 | 根目錄 |
| `npm run build` | 建置 Next.js | 根目錄 |
| `npm run build:worker` | 建置 Workers | 根目錄 |
| `npm run deploy` | 部署 Next.js | 根目錄 |
| `npm run deploy:worker` | 部署 Workers | 根目錄 |
| `npm run lint` | 程式碼檢查 | 根目錄 |
