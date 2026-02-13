# DevTools 拆彈演練

> Chrome DevTools 實戰挑戰 | 透過五個關卡掌握前端除錯技巧

這是一個互動式的 Chrome DevTools 教學遊戲，採用劇情導向設計。你需要在有限時間內，使用 DevTools 找出線索、收集密碼碎片，最終拆除炸彈。

---

## 專案特色

- 五個關卡對應 DevTools 核心面板
- 劇情對話與提示引導學習流程
- 全前端實作，無後端依賴
- 支援鍵盤操作與音檔對話播放

---

## 快速開始

### 本地執行

```bash
npm install
npm run dev
```

瀏覽器開啟 `http://localhost:5173`。

### 建置與預覽

```bash
npm run build
npm run preview
```

---

## 遊戲流程

### 劇情推進

- 右下角箭頭或鍵盤右方向鍵推進對話
- 鍵盤左方向鍵回到上一段
- 空白鍵重播當前對話音檔

### 密碼碎片

- 每個關卡取得一段密碼碎片
- 最終密碼為：`DevTools2026`
- 碎片組成：`Dev` + `Tools` + `20` + `2026`

---

## 關卡攻略

### 關卡一：隱形計時器

**目標**：找出隱藏的真實計時器

**密碼碎片**：`Dev`

**提示**：
1. 開啟 DevTools → Console 面板
2. 點擊 Live Expression（眼睛圖示）
3. 輸入：
   ```javascript
   window.game.timer
   ```

**學習重點**：Live Expression 可即時監控變數

---

### 關卡二：資料庫碎片

**目標**：在多個儲存位置找出線索

**密碼碎片**：`Tools`

**提示**：
1. 開啟 Application（或 Storage）面板
2. 依序檢查：
   - Cookies
   - Local Storage
   - Session Storage
   - IndexedDB（DevToolsDB）
3. 組合碎片後回到 Console 驗證：
   ```javascript
   window.game.verifyLevel2("Tools")
   ```

**學習重點**：理解不同瀏覽器儲存機制

---

### 關卡三：渲染壓力測試

**目標**：找出效能瓶頸並修復

**密碼碎片**：`20`

**提示**：
1. 開啟 Performance 面板錄製 3-5 秒
2. 找出紅色 Long Task
3. 在 Console 執行：
   ```javascript
   window.stopLag()
   ```

**學習重點**：使用 Performance 找出主執行緒瓶頸

---

### 關卡四：網路雜訊過濾

**目標**：在雜訊中找到關鍵提示並完成 API override

**密碼碎片**：`2026`

**提示**：
1. 開啟 Network 面板
2. 觀察高頻雜訊請求（/noise-signal-404.json）
3. 右鍵雜訊請求 → Block request URL
4. 在成功請求中找到 hint-override.json，查看 Response
5. 依照提示使用 Local Overrides 改寫 /secret-data.json
6. 重新載入頁面，取得隱藏碎片
7. 回到 Console 驗證：
   ```javascript
   window.game.foundFragment(4, "2026")
   ```

**學習重點**：Request Blocking、Response 觀察、Local Overrides

---

### 關卡五：邏輯劫持

**目標**：修正程式邏輯錯誤並通關

**提示**：
1. 輸入密碼 `DevTools2026`
2. 失敗後開啟 Sources 面板
3. 搜尋 `submitPassword`
4. 找到 `isSystemIntegrityCheckPassed`，改為 `true`
5. 重新載入後再輸入密碼

**學習重點**：Breakpoint、Scope 檢視與程式修改

---

## 專案結構

```
devtool-conference/
├── index.html
├── js/
│   ├── game.js
│   ├── main.js
│   └── tailwind.config.js
├── css/
│   └── style.css
├── public/
│   ├── audio/
│   │   └── id-*.mp3
│   ├── config.json
│   ├── hint-override.json
│   └── secret-data.json
├── assets/
├── stitch/
└── README.md
```

---

## 技術架構

- Vite
- Tailwind CSS
- Vanilla JavaScript
- 全前端、無後端

---

## 音檔對話

- 對話音檔放在 public/audio
- 檔名格式：`id-{sceneId}.mp3`
- 空白鍵可重播當前對話

---

## 參考資料

- https://developer.chrome.com/docs/devtools/
- https://developer.chrome.com/docs/devtools/storage/overview/
- https://developer.chrome.com/docs/devtools/javascript/
- https://web.dev/fast/
