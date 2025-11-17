## 專案升級：全棧式 AI 辯論與角色扮演平台 (The AI Role-Play & Debate Platform)

這個專案的核心優勢在於它能展示 **多 Agent 的複雜互動**和 **即時的聊天/辯論介面**，非常適合用來放在履歷上。

### 核心功能一：動態辯論室 (Dynamic Debate Chamber)

**目標：** 用戶設定一個主題，平台上的 Agents (扮演不同角色) 進行即時辯論。

| 角色 (Agent Node) | 職責與 LLM 特性 | LangGraph 流程展示點 |
| :--- | :--- | :--- |
| **Orchestrator** | 決定當前發言順序，如果 Agent 們開始離題，它將流程拉回正軌。 | **流程控制**：條件轉移 (輪到誰發言)。 |
| **Optimist** | 始終從積極、樂觀的角度進行論證，調用 Web Search 找支持數據。 | **工具調用**：Agent 根據角色需求使用工具。 |
| **Skeptic** | 負責質疑 Optimist 的論點，從風險、弱點的角度進行反駁。 | **狀態管理**：Agent 需記住並引用前一個 Agent 的論點。 |
| **Moderator** | 在辯論結束後，總結雙方論點，並生成一個中立的結論報告。 | **流程結束**：在達到特定輪數後終止迴圈。 |

**網頁介面亮點：**
*   **即時聊天介面：** 使用 WebSocket 串流顯示每個 Agent 的發言，模擬真人辯論。
*   **視覺化：** 為每個 Agent 設計一個頭像和身份標籤。

---

### 核心功能二：專家角色扮演問答 (Expert Role-Play Consultation)

**目標：** 用戶可以選擇讓 Agent 扮演一個特定的專業人士來回答問題，並由另一個 Agent 進行事實校驗。

| 角色 (Agent Node) | 職責與 LLM 特性 | LangGraph 流程展示點 |
| :--- | :--- | :--- |
| **User Proxy** | 接收用戶問題。 | - |
| **Persona Agent** | 扮演特定角色 (ex: 科技創業家、歷史學家、金融分析師) 來回答問題。**使用開源模型微調**來加強角色性。 | **多模型切換**：展示平台能為不同 Agent 快速切換模型 (ex: 用 Groq 跑一個 Llama 3 當 Persona Agent)。 |
| **Fact Checker** | **核心！** 收到 Persona Agent 的回答後，立即調用 Web Search 進行**事實檢驗 (Fact Check)**。 | **安全與準確性**：這是企業級 AI 應用必須具備的**防幻覺 (Anti-Hallucination)** 功能，極具履歷價值。 |
| **Finalizer** | 整合 Persona 的回答和 Fact Checker 的註釋/更正，生成最終輸出。 | **結果整合**。 |

**網頁介面亮點：**
*   **角色選擇器：** 用戶可選擇 Agent 的身份。
*   **校驗標籤：** 在 Persona Agent 的回答中，用顏色或標籤標示出 Fact Checker 已經確認或修正的部分。

---

### 技術棧的調整與強化

| 領域 | 調整建議 | 履歷亮點 |
| :--- | :--- | :--- |
| **Agent 核心** | 堅持 **LangGraph**，專注於**Agent 間的溝通**和**迴圈/條件轉移**。 | **Complex Multi-Agent Workflow** |
| **即時性** | **強化 WebSocket！** 讓每個 Agent 的「思考過程」和「工具調用」都即時在前端日誌中顯示。 | **Real-Time Log & Streaming** |
| **數據層** | **新增 VDB (向量資料庫)**：例如使用開源的 **Chroma** 或 **LanceDB** 進行本地 RAG。 | 讓 Agent 不僅能上網搜尋，還能從**專門的知識庫**中獲取數據。 |
| **UI/UX** | 確保聊天和辯論介面有**專門設計**，而不是單純的文本框。 | **UI/UX for AI Interaction** |

### 結語

選擇「AI 辯論與角色扮演平台」將讓您的專案具備：
1.  **高度互動性**：用戶參與感強。
2.  **視覺化效果**：即時聊天和角色頭像更吸睛。
3.  **技術深度**：完美展示 **LangGraph 迴圈、多 Agent 溝通、事實校驗 (Fact Checking)** 等企業級 AI 應用所需的複雜技術。

---

## 本專案最終完整規劃（全 Cloudflare 版本）

這一節是實際要實作的「完整計畫」，以 **Cloudflare Pages + Cloudflare Workers** 為唯一平台，並以「3–4 個 AI 互相辯論」為核心功能。

### 專案目標

- 建立一個可在履歷展示的 **多 Agent AI 辯論平台**。  
- 強調三件事：
  - **Agent 協作與流程控制（LangGraph）**
  - **即時串流體驗（SSE）**
  - **雲端部署與架構設計（Cloudflare 全家桶）**

### 最終架構：全 Cloudflare

- **前端：Next.js 16 + React 19 + Tailwind**
  - 使用 App Router，放在 `app/` 目錄。
  - 部署在 **Cloudflare Pages**。
  - 主要頁面：
    - `app/debate/page.tsx`：建立新辯論。
    - `app/debate/[id]/page.tsx`：觀看特定辯論（接 SSE）。

- **後端：Cloudflare Workers + Hono + LangGraph.js**
  - 一支 Worker，使用 Hono 管理路由。
  - 主要 API：
    - `POST /api/debate`：建立一場新辯論，回傳 `sessionId`。
    - `GET /api/debate/:id/stream`：啟動辯論流程，透過 **SSE** 串流每個 Agent 的發言。
  - Worker 內部使用 **LangGraph.js** 建立多 Agent 流程：
    - `DebateState`（messages, topic, turn, next）
    - `Orchestrator` / `Optimist` / `Skeptic` / `Moderator` 等節點。

- **資料層：先簡單，後續再加**
  - **MVP 階段**：不使用任何外部資料庫，所有辯論 state 都存在單次請求的 LangGraph state 中，結束後一次丟給前端。
  - **V1.5 之後**（可選）：
    - 使用 **Cloudflare KV**：
      - Key：`debate:<sessionId>`
      - Value：整場辯論的 JSON（topic + messages + summary）。
    - 或使用 **Cloudflare D1**：
      - `sessions(id, topic, created_at, summary)`
      - `messages(id, session_id, turn, agent, content, created_at)`

- **LLM 層：Groq + OpenRouter（免費為優先）**
  - 使用 Groq（例如 `llama-3.1-8b-instant`）做主要模型。
  - 可以視需要搭配 OpenRouter 免費模型，為不同 Agent 指定不同模型。
  - API Key 存在 Cloudflare Workers 的 Secrets。

---

## MVP 功能規劃（第一版一定要完成的）

### 1. 多 Agent 辯論室（3–4 個 AI）

- 使用者流程：
  - 在前端輸入辯論主題（例如：「AI 是否會取代人類工作？」）。
  - 選擇基本參數（例如：辯論回合數 2–3 輪）。
  - 點選「開始辯論」，前端向 Worker 發出請求，建立 `sessionId`，並建立 SSE 連線。
- Agent 角色設計（MVP 版本）：
  - **Orchestrator**
    - 控制誰先講、誰後講，決定辯論何時結束。
    - 讀取 state（`turnCount`, `messages`），決定 `next` 應該是 Optimist / Skeptic / END。
  - **Optimist**
    - 正方立場，負責從樂觀、支持的角度論證主題。
  - **Skeptic**
    - 反方立場，負責質疑、反駁 Optimist 的觀點。
  - **Moderator**
    - 當回合數達到上限時，由 Orchestrator 轉換到「總結模式」。
    - 整理前面所有 messages，生成一段中立的辯論總結與結論。

- 辯論流程（MVP 版本）：
  - START → Orchestrator → Optimist → Orchestrator  
    → Skeptic → Orchestrator  
    → Optimist → Orchestrator  
    → Skeptic → Orchestrator  
    → [達到設定輪數] → Moderator (總結) → END

### 2. 即時串流與前端介面

- **即時串流：SSE（Server-Sent Events）**
  - Workers 在跑 LangGraph 時，對每個 Agent 的輸出，立即 `enqueue` 一段 SSE 資料：
    - 例如：`data: {"agent":"Optimist","content":"...","turn":1}\n\n`
  - 前端頁面透過 `EventSource` 或 `fetch + ReadableStream` 接收，將訊息逐一加入畫面。

- **UI/UX 設計重點：**
  - 訊息時間線：
    - 不同 Agent 使用不同背景色/邊框/頭像（Ex: Optimist 綠色、Skeptic 紅色、Moderator 藍色）。
    - 顯示 `agent 名稱 + 回合數 + 時間戳`。
  - 辯論設定區：
    - 主題輸入框。
    - 回合數選擇（例如 2–5）。
    - 「開始辯論」按鈕，按下後鎖定設定並建立 SSE 連線。
  - 辯論結束區：
    - 獨立區塊顯示 Moderator 的總結與結論。

---

## 後續可擴充功能（V1 之後）

這些功能不是 MVP 必須，但未來可以依照時間和精力加入，增加履歷亮點。

- **歷史辯論紀錄**
  - 使用 Cloudflare KV 或 D1 儲存每場辯論的 `sessionId + topic + messages + summary`。
  - 新增 `/history` 頁面，讓使用者可以瀏覽過去的辯論。

- **第四個 Agent：Expert / Fact Checker**
  - 在 Optimist / Skeptic 的辯論後，引入一個「專家」Agent：
    - 根據雙方論點給出專業分析或事實校驗。
  - 這個 Agent 可以使用額外的工具（Web Search / RAG）來查證內容。

- **Web Search / RAG 整合**
  - 為 Optimist / Skeptic 或 Expert Agent 加上工具：
    - Web Search：請求外部搜尋 API（視成本與政策而定）。
    - 簡易 RAG：之後可加入向量資料庫（例如 Cloudflare Vectorize 或其他服務），讓 Agent 可以引用特定知識庫。

- **多語言與角色客製化**
  - 讓使用者選擇辯論語言（中文/英文）。
  - 讓使用者客製各 Agent 的個性（溫度、說話風格、專業背景）。

---

## 開發階段計畫（Roadmap）

### Phase 0：平台打底（Cloudflare Pages + Workers + SSE）

- 把現有 Next.js 專案部署到 Cloudflare Pages。
- 建一支最簡單的 Workers + Hono API：
  - `GET /api/debug/stream`：每秒推 `{"agent":"System","content":"tick"}`，確認 SSE 正常。
- 在前端加一個測試頁面，確認可以從 Pages 接到 Workers 的 SSE。

### Phase 1：單場辯論 MVP（無資料庫）

- 在 Worker 中先用「手寫 orchestrator」+ Groq/OpenRouter，實作一場 2–3 Agent 的辯論流程（不使用 LangGraph）。
- 完成前端 `/debate` 頁面：
  - 輸入主題與回合數。
  - 建立 SSE 連線，顯示各 Agent 的發言與 Moderator 總結。
- 確認：整體流程在 Cloudflare 環境下穩定可用。

### Phase 2：導入 LangGraph.js（核心技術亮點）

- 將 Phase 1 的手寫流程，抽象成 LangGraph：
  - 新增 `lib/langgraph/state.ts`：定義 `DebateState`。
  - 新增 `lib/langgraph/agents.ts`：定義 `optimistNode / skepticNode / orchestratorNode / moderatorNode`。
  - 新增 `lib/langgraph/debate-graph.ts`：使用 `StateGraph` 組裝 workflow，並提供 `createDebateGraph()`。
- 在 Workers 的 SSE API 中，改成：
  - 使用 `graph.stream(initialState, config)` 逐步取得各節點輸出，並轉成 SSE 事件送給前端。
- 此階段不使用 checkpoint（不接 DB），降低複雜度，先確保 LangGraph 在 Workers 上可運作。

### Phase 3：資料庫與歷史紀錄（可選）

- 選擇一種 Cloudflare 資料方案：
  - 簡單版：Cloudflare KV，存整場辯論 JSON。
  - 進階版：Cloudflare D1，設計 sessions/messages 資料表。
- 在辯論結束時：
  - Worker 將 `sessionId + topic + messages + summary` 寫進 KV/D1。
- 前端新增 `/history`：
  - 列出過去的辯論，點擊可進入詳細內容頁。

---

## 成本與技術學習重點

- **成本**
  - Cloudflare Pages：免費。
  - Cloudflare Workers：免費額度足夠個人專案使用。
  - Cloudflare KV / D1：有免費額度。
  - Groq / OpenRouter：使用免費或低成本模型，控制請求量即可。

- **技術學習收穫**
  - Next.js 16 + React 19 + Tailwind UI 開發。
  - Cloudflare Workers + Hono + SSE API 設計。
  - LangGraph.js 多 Agent 流程設計與狀態管理。
  - Edge 環境下的 LLM 應用與部署經驗。

這份規劃就是本專案接下來的開發藍圖，之後可以依照 Phase 0 → 3 的順序逐步實作。
