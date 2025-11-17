# 專案文檔

本目錄包含專案的所有詳細文檔。

## 📚 文檔結構

```
docs/
├── README.md                    # 本文件
└── config/                      # 配置文件文檔
    ├── README.md                # 配置文件索引
    ├── next.config.ts.md        # Next.js 配置說明
    ├── wrangler.toml.md         # Workers 配置說明
    ├── workers-package.json.md  # Workers 套件說明
    ├── workers-tsconfig.json.md # Workers TypeScript 說明
    ├── environment-variables.md # 環境變數完整指南
    └── package-scripts.md       # NPM Scripts 說明
```

---

## 🚀 快速開始

### 新手入門
1. [專案設定指南](../README_SETUP.md) - 從安裝到啟動的完整步驟
2. [環境變數設定](./config/environment-variables.md) - API Keys 申請與設定
3. [NPM Scripts](./config/package-scripts.md) - 常用開發指令

### 配置文件
前往 [config/](./config/README.md) 查看所有配置文件的詳細說明。

---

## 📖 文檔導航

### 按角色

#### 👨‍💻 開發者
- [環境變數設定](./config/environment-variables.md)
- [NPM Scripts 使用指南](./config/package-scripts.md)
- [Next.js 配置](./config/next.config.ts.md)

#### 🚀 部署人員
- [Wrangler 配置](./config/wrangler.toml.md)
- [環境變數設定](./config/environment-variables.md)
- [部署流程](../README_SETUP.md#建置與部署)

#### 🏗️ 架構師
- [專案架構](../README.md#最終架構全-cloudflare)
- [技術棧說明](../README.md#技術棧的調整與強化)
- [開發階段計畫](../README.md#開發階段計畫roadmap)

---

## 🔍 按主題

### 配置管理
- [Next.js 配置文件](./config/next.config.ts.md)
- [Workers 配置文件](./config/wrangler.toml.md)
- [TypeScript 配置](./config/workers-tsconfig.json.md)
- [套件管理](./config/workers-package.json.md)

### 環境與部署
- [環境變數完整指南](./config/environment-variables.md)
- [本地開發環境設定](../README_SETUP.md#本地開發)
- [生產環境部署](../README_SETUP.md#部署到-cloudflare)

### 開發工具
- [NPM Scripts 說明](./config/package-scripts.md)
- [常用指令組合](./config/package-scripts.md#常用指令組合)
- [除錯技巧](./config/environment-variables.md#除錯技巧)

---

## 📂 相關文件

### 根目錄文件
- [README.md](../README.md) - 專案總覽與開發計畫
- [README_SETUP.md](../README_SETUP.md) - 設定指南
- [package.json](../package.json) - 前端套件配置
- [next.config.ts](../next.config.ts) - Next.js 配置

### Workers 文件
- [workers/api/package.json](../workers/api/package.json) - Workers 套件配置
- [workers/api/wrangler.toml](../workers/api/wrangler.toml) - Workers 部署配置
- [workers/api/tsconfig.json](../workers/api/tsconfig.json) - TypeScript 配置

---

## 🆘 遇到問題？

1. **先查看對應的文檔**
   - 每個配置文件都有詳細的說明和常見問題

2. **檢查設定**
   - [環境變數除錯](./config/environment-variables.md#除錯技巧)
   - [常見錯誤排查](./config/README.md#常見錯誤)

3. **參考官方文檔**
   - [Cloudflare Workers](https://developers.cloudflare.com/workers/)
   - [Next.js](https://nextjs.org/docs)
   - [LangGraph.js](https://langchain-ai.github.io/langgraphjs/)

---

## 📝 文檔維護

### 新增文檔
1. 在對應目錄建立 `.md` 檔案
2. 更新該目錄的 `README.md`
3. 更新本文件的導航

### 更新文檔
- 確保範例程式碼與實際配置一致
- 更新版本號（如果套件版本變更）
- 新增常見問題到 FAQ 區段

---

## 🔗 外部資源

### 官方文檔
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Hono Documentation](https://hono.dev/)
- [LangGraph.js Documentation](https://langchain-ai.github.io/langgraphjs/)

### 社群資源
- [Cloudflare Discord](https://discord.gg/cloudflaredev)
- [Next.js Discord](https://nextjs.org/discord)
- [LangChain Discord](https://discord.gg/langchain)

### API 服務
- [Groq Console](https://console.groq.com/)
- [OpenRouter](https://openrouter.ai/)

---

## 📊 文檔統計

- **配置文件文檔**：7 個
- **涵蓋配置文件**：6 個
- **總字數**：約 15,000 字
- **最後更新**：2025-11-17

---

**提示**：建議將本目錄加入書籤，方便隨時查閱！
