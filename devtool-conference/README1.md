# 💣 DevTools 拆彈演練

> **Chrome DevTools 實戰挑戰 | 透過劇情導向的五個關卡掌握前端除錯神技**

<div align="center">

🎯 **挑戰目標：** 使用 Chrome DevTools 解開五個關卡,收集密碼碎片，成功拆除炸彈！

⏱️ **預估時間：** 20-30 分鐘

🔧 **所需工具：** Chrome 瀏覽器 + DevTools

</div>

---

## 🎮 專案簡介

這是一個互動式的 Chrome DevTools 教學遊戲，採用**劇情導向**設計。神秘駭客在大樓中安裝了炸彈，你需要透過 DevTools 逐步破解線索，最終拆除炸彈。透過五個精心設計的關卡，你將學會：

- 🔍 **Console 面板**：Live Expressions 即時監控變數
- 💾 **Application 面板**：檢視 Cookies 和 LocalStorage
- ⚡ **Performance 面板**：診斷效能瓶頸與 Long Tasks
- 🌐 **Network 面板**：過濾請求與分析 API 回應
- 🐛 **Sources 面板**：程式碼中斷點與邏輯修改

---

## 🚀 快速開始

### 本地執行

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 建置生產版本
npm run build
```

然後開啟瀏覽器訪問 `http://localhost:5173`。

---

## 📖 遊戲流程

### 劇情系統

遊戲採用**階段式故事推進**：
1. **駭客對話框**會逐步揭示線索
2. 完成關卡後，點擊右下角 **➡️ 箭頭**（或按鍵盤 **右方向鍵**）推進劇情
3. 部分劇情需要**完成特定關卡**才會解鎖

### 密碼碎片收集

- 每個關卡會獲得一個**密碼碎片**
- 最終需要組合所有碎片成完整密碼：`DevTools2026`
- 碎片組成：`Dev` + `Tools` + `20` + `2026`

---

## 💡 關卡攻略指南

### 關卡一：隱形計時器 🕐

**目標**：找出隱藏的真實計時器

**密碼碎片**：`Dev`

**提示**：
1. 開啟 Chrome DevTools（按 `F12` 或 `Cmd+Option+I`）
2. 切換到 **Console** 面板
3. 駭客會在 Console 中給出提示：使用 **Live Expression**
4. 點擊 Console 左上角的 **「眼睛」圖示** 👁️
5. 輸入 `window.game.timer` 並按 Enter
6. 觀察數值每秒遞減 - 這就是真實的計時器！

**學習重點**：
- Live Expression 可以即時監控變數變化，無需手動 `console.log()`
- 全域變數可以在 Console 中直接存取

---

### 關卡二：資料庫碎片 �

**目標**：在 Application 面板中找到密碼碎片

**密碼碎片**：`Tools`

**提示**：
1. 開啟 **Application** 面板（Chrome 120+ 版本稱為 **Storage** 面板）
2. 在以下位置尋找碎片：
   - **Cookies**：展開 `Cookies` → 選擇當前網站
   - **LocalStorage**：展開 `Local Storage` → 選擇當前網站
3. 找到碎片後，回到 **Console** 驗證：
   ```javascript
   window.game.foundFragment(2, "Tools")
   ```
4. 密碼正確會顯示 🎉，錯誤會提示重試

**學習重點**：
- Cookie：小容量、可設定過期時間、自動夾帶在請求中
- LocalStorage：同步存取、5-10MB 容量、Key-Value 結構
- 手動驗證機制確保使用者真正找到了資料

---

### 關卡三：渲染壓力測試 ⚡

**目標**：找出導致頁面卡頓的效能問題

**密碼碎片**：`20`

**提示**：
1. 開啟 **Performance** 面板
2. 點擊錄製按鈕（⚫ 圓點圖示），等待 3-5 秒後停止
3. 在時間軸中尋找紅色的 **Long Task**（執行時間超過 50ms 的任務）
4. 點擊查看詳細資訊，找出 `stopLag()` 函式
5. 在 Console 中呼叫：
   ```javascript
   window.stopLag()
   ```
6. 效能問題解除，獲得碎片！

**學習重點**：
- Performance 面板的 Flame Chart（火焰圖）顯示函式呼叫堆疊
- Long Task 會阻塞主執行緒，影響使用者體驗
- 紅色標記表示需要優化的任務

---

### 關卡四：網路雜訊過濾 🌐

**目標**：在大量無用請求中找到真正的設定檔

**密碼碎片**：`2026`

**提示**：
1. 開啟 **Network** 面板
2. 觀察大量的 404 錯誤請求（每 4 秒一次的雜訊）
3. 使用 **Filter** 功能：
   - 輸入關鍵字 `config` 或 `200` 來過濾
   - 或者點擊 **Status** 欄位排序，找出 200 OK 的請求
4. 找到 `config.json` 請求，點擊查看 **Response** 標籤
5. 在回應中找到 `SECRET_CODE_FRAGMENT: "2026"`
6. 回到 Console 驗證：
   ```javascript
   window.game.foundFragment(4, "2026")
   ```

**學習重點**：
- 使用 Filter 快速定位目標請求
- Status Code：200（成功）、404（找不到）、500（伺服器錯誤）
- Response 標籤顯示 API 回應內容

---

### 關卡五：邏輯劫持 🐛

**目標**：修正程式中的邏輯錯誤

**密碼碎片**：解鎖最終密碼輸入

**提示**：
1. 完成前 4 關後，中間的密碼輸入框會解鎖
2. 輸入完整密碼：`DevTools2026`
3. 發現即使密碼正確，仍然失敗（顯示錯誤訊息）
4. 開啟 **Sources** 面板
5. 按 `Cmd+P`（Mac）或 `Ctrl+P`（Windows）搜尋 `game.js`
6. 按 `Cmd+F` 搜尋 `submitPassword` 函式
7. 在包含 `&& false` 的那一行設置 **Breakpoint**（點擊行號）
8. 再次點擊拆彈按鈕，觀察程式暫停
9. **修正方式**：
   - 在 Scope 面板中手動修改變數
   - 或直接在編輯器中刪除 `&& false`，重新載入
10. 成功拆除炸彈！🎉

**學習重點**：
- Breakpoint 暫停程式執行，方便除錯
- Scope 面板顯示當前作用域的所有變數
- 可以在 DevTools 中即時修改程式邏輯進行測試

---

## 🎯 完成所有關卡後

當你成功修正邏輯並輸入正確密碼後，你將看到：

```
🎉 拆彈成功！你已經掌握了 Chrome DevTools 的所有技巧！
```

恭喜你！你已經具備了專業前端工程師的除錯能力。

---

## 🛠️ 技術架構

### 技術棧

- **Vite**：快速的開發伺服器與建置工具
- **Tailwind CSS**：原子化 CSS 框架
- **Vanilla JavaScript**：純 JS，無框架依賴
- **無需後端**：所有功能均在瀏覽器端完成

### 關卡技術細節

| 關卡 | 密碼碎片 | DevTools 面板 | 驗證方式 |
|------|---------|--------------|---------|
| Level 1 | `Dev` | Console (Live Expression) | 自動檢測 `window.game.timer` 訪問 |
| Level 2 | `Tools` | Application (Cookies/LocalStorage) | 手動呼叫 `foundFragment(2, "Tools")` |
| Level 3 | `20` | Performance (Long Tasks) | 呼叫 `window.stopLag()` |
| Level 4 | `2026` | Network (Filter/Response) | 手動呼叫 `foundFragment(4, "2026")` |
| Level 5 | - | Sources (Breakpoint/Edit) | 修改邏輯並輸入完整密碼 |

### 專案結構

```
devtool-conference/
├── index.html              # 主遊戲頁面
├── js/
│   ├── game.js            # 遊戲核心邏輯
│   ├── main.js            # 初始化與工具函式
│   └── tailwind.config.js # Tailwind 設定
├── css/
│   └── style.css          # 自訂樣式
├── public/
│   └── config.json        # Level 4 的 API 模擬資料
└── README.md              # 本文件
```

---

## 🎨 設計特色

### 響應式設計
- **桌面版（≥720px）**：
  - 2 欄位布局（炸彈 | 駭客對話）
  - 左側浮動式收折任務目標側邊欄
- **手機版（<720px）**：
  - 垂直排列（炸彈 → 駭客對話 → 任務目標）
  - 靜態任務列表

### 鍵盤快捷鍵
- **右方向鍵（→）**：推進駭客對話（當 ➡️ 箭頭可見時）

### 視覺效果
- Glassmorphism（玻璃擬態）設計
- 動態炸彈動畫（浮動效果）
- 駭客風格終端機介面
- 暗色主題（科技感）

---

## 📚 延伸學習資源

- [Chrome DevTools 官方文件](https://developer.chrome.com/docs/devtools/)
- [Performance 優化指南](https://web.dev/fast/)
- [Application 面板完整指南](https://developer.chrome.com/docs/devtools/storage/overview/)
- [Sources 面板除錯教學](https://developer.chrome.com/docs/devtools/javascript/)

---

## 🤝 貢獻與回饋

這個專案是為技術分享會設計的教學工具。如果你有任何建議或發現 Bug，歡迎：

- 開啟 Issue 回報問題
- 提交 Pull Request 改進內容
- 分享給更多想學習 DevTools 的朋友

---

## 📜 授權

本專案採用 MIT 授權條款，歡迎自由使用與修改。

---

## 👨‍💻 作者

由 **des86532** 設計與開發，用於 DevTools 主題技術分享會。

---

<div align="center">

**🎮 準備好接受挑戰了嗎？現在就開始拆彈吧！**

</div>
