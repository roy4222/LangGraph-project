# Next.js 配置文件

**檔案位置**：`next.config.ts`

## 完整內容

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages 部署設定
  // 階段一：使用 static export（最簡單）
  // 階段二：可改用 @opennextjs/cloudflare（支援 SSR）

  // output: 'export', // 靜態匯出（uncomment for static deployment）

  // API 路由設定（連接到 Cloudflare Workers）
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`
          : 'http://localhost:8787/api/:path*', // 本地開發用
      },
    ];
  },

  // CORS 設定（開發時需要）
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ];
  },
};

export default nextConfig;
```

## 設定說明

### 1. Cloudflare Pages 部署設定

#### 方法一：靜態匯出（Static Export）

```typescript
output: 'export'
```

**優點**：
- 最簡單，無需額外設定
- 所有頁面預先建置為靜態 HTML
- 適合純前端應用

**缺點**：
- 不支援 Server-Side Rendering (SSR)
- 不支援 API Routes
- 不支援 `getServerSideProps`

**使用時機**：Phase 0-1，純前端 + Workers API

---

#### 方法二：@opennextjs/cloudflare（進階）

```typescript
// 安裝
npm install @opennextjs/cloudflare

// next.config.ts
import { setupDevPlatform } from '@opennextjs/cloudflare';

if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform();
}

const nextConfig: NextConfig = {
  // ...
};
```

**優點**：
- 支援 SSR
- 支援 Next.js API Routes
- 更完整的 Next.js 功能

**缺點**：
- 設定較複雜
- 需要額外的 `wrangler.toml` 設定
- Bundle size 限制更容易超標

**使用時機**：Phase 2+，需要 SSR 功能時

---

### 2. API 路由代理（Rewrites）

```typescript
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: process.env.NEXT_PUBLIC_API_URL
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`
        : 'http://localhost:8787/api/:path*',
    },
  ];
}
```

**作用**：
- 前端呼叫 `/api/debate` 時，自動轉發到 Workers
- 本地開發：轉發到 `localhost:8787`
- 生產環境：轉發到 `NEXT_PUBLIC_API_URL`（部署後的 Workers URL）

**範例**：
```typescript
// 前端程式碼
fetch('/api/debate', { method: 'POST', body: JSON.stringify({ topic }) })

// 實際請求到
// 本地：http://localhost:8787/api/debate
// 生產：https://debate-api.your-account.workers.dev/api/debate
```

---

### 3. CORS 設定（Headers）

```typescript
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Credentials', value: 'true' },
        { key: 'Access-Control-Allow-Origin', value: '*' },
        { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
        { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
      ],
    },
  ];
}
```

**為什麼需要**：
- 本地開發時，前端 (`localhost:3000`) 和 Workers (`localhost:8787`) 是不同的 origin
- 瀏覽器會阻擋跨域請求（CORS 錯誤）
- 這些 headers 允許跨域請求

**生產環境**：
- 如果前端和 Workers 在同一個網域下，可以移除
- 或在 Workers 端設定 CORS（更推薦）

---

## 環境變數

### 設定 `.env.local`

```bash
NEXT_PUBLIC_API_URL=https://debate-api.your-account.workers.dev
```

- `NEXT_PUBLIC_` 開頭的變數會暴露給瀏覽器
- 部署時需要在 Cloudflare Pages Dashboard 設定

---

## 常見問題

### Q: 為什麼本地開發時 API 請求失敗？

**檢查清單**：
1. Workers 是否正常運行？
   ```bash
   curl http://localhost:8787/api/health
   ```
2. `rewrites` 設定是否正確？
3. Workers 是否啟用 CORS？

---

### Q: 部署後 API 請求失敗？

**檢查**：
1. Cloudflare Pages 環境變數是否設定 `NEXT_PUBLIC_API_URL`？
2. Workers 是否已部署並正常運行？
3. Workers URL 是否正確？

---

### Q: 如何在生產環境使用 SSR？

**使用 @opennextjs/cloudflare**：
```bash
npm install @opennextjs/cloudflare
```

參考官方文件：
https://opennext.js.org/cloudflare

---

## 相關文件

- [Next.js Config Options](https://nextjs.org/docs/app/api-reference/config/next-config-js)
- [Rewrites](https://nextjs.org/docs/app/api-reference/config/next-config-js/rewrites)
- [Headers](https://nextjs.org/docs/app/api-reference/config/next-config-js/headers)
- [@opennextjs/cloudflare](https://opennext.js.org/cloudflare)
