# Workers API - tsconfig.json

**檔案位置**：`workers/api/tsconfig.json`

## 完整內容

```json
{
  "compilerOptions": {
    // 基本設定
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022"],
    "moduleResolution": "bundler",

    // 型別檢查
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,

    // 輸出設定
    "outDir": "./dist",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,

    // 模組解析
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,

    // 特殊設定
    "skipLibCheck": true,
    "isolatedModules": true,

    // Cloudflare Workers 型別
    "types": ["@cloudflare/workers-types"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## 設定說明

### 編譯目標

| 選項 | 值 | 說明 |
|------|-----|------|
| `target` | `ES2022` | 編譯為 ES2022 語法（Workers 支援） |
| `module` | `ESNext` | 使用最新 ES Modules |
| `lib` | `["ES2022"]` | 引入 ES2022 標準函式庫 |
| `moduleResolution` | `bundler` | 適用於 Wrangler 打包工具 |

### 型別檢查（嚴格模式）

```json
"strict": true,
"noUnusedLocals": true,
"noUnusedParameters": true,
"noFallthroughCasesInSwitch": true,
"noUncheckedIndexedAccess": true
```

- **strict**：啟用所有嚴格型別檢查
- **noUnusedLocals**：未使用的變數會報錯
- **noUnusedParameters**：未使用的參數會報錯
- **noFallthroughCasesInSwitch**：switch 必須有 break/return
- **noUncheckedIndexedAccess**：陣列/物件存取必須檢查 undefined

### Workers 專用設定

```json
"types": ["@cloudflare/workers-types"]
```

- 引入 Cloudflare Workers 的型別定義
- 提供 `Request`、`Response`、`env` 等 Workers 專屬型別

### 輸出設定

```json
"outDir": "./dist",
"declaration": true,
"declarationMap": true,
"sourceMap": true
```

- **outDir**：編譯輸出到 `dist/` 目錄
- **declaration**：生成 `.d.ts` 型別檔案
- **sourceMap**：生成 source map（除錯用）

## 與根目錄 tsconfig.json 的差異

| 項目 | 根目錄 (Next.js) | Workers |
|------|------------------|---------|
| `target` | `ES5` / `ES2015` | `ES2022` |
| `moduleResolution` | `node` | `bundler` |
| `types` | React, Next.js | Workers |
| `jsx` | `preserve` | 無 |

## 常見問題

### Q: 為什麼 Workers 需要獨立的 tsconfig.json？
因為 Workers 和 Next.js 的執行環境不同：
- Workers 不支援 React/JSX
- Workers 使用不同的模組解析策略
- Workers 有專屬的全域型別（如 `env`）

### Q: 如何新增路徑別名（path alias）？
```json
"compilerOptions": {
  "baseUrl": "./src",
  "paths": {
    "@/*": ["./*"],
    "@lib/*": ["./lib/*"]
  }
}
```

### Q: 編譯錯誤：找不到 Workers 型別
確認已安裝：
```bash
npm install -D @cloudflare/workers-types
```
