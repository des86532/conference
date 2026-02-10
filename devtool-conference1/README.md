# 💣 DevTools 拆彈演練

> **Chrome DevTools 實戰挑戰 | 透過五個關卡掌握前端除錯神技**

<div align="center">

📍 **線上展示：** [https://des86532.github.io/devtool-game/](https://des86532.github.io/devtool-game/)

🎯 **挑戰目標：** 使用 Chrome DevTools 解開五個關卡，成功拆除炸彈！

⏱️ **預估時間：** 20-30 分鐘

🔧 **所需工具：** Chrome 瀏覽器 + DevTools

</div>

---

## 🎮 專案簡介

這是一個互動式的 Chrome DevTools 教學遊戲，設計用於技術分享會或自主學習。透過五個精心設計的關卡，你將學會：

- 🔍 **Console 面板**：監控全域變數與即時表達式
- 💾 **Application 面板**：操作 Cookie、LocalStorage 與 IndexedDB
- ⚡ **Performance 面板**：診斷效能瓶頸與渲染問題
- 🌐 **Network 面板**：分析網路請求與模擬網路環境
- 🐛 **Sources 面板**：即時修改程式邏輯與中斷點除錯

---

## 🚀 快速開始

### 線上挑戰

直接開啟瀏覽器訪問：**[https://des86532.github.io/devtool-game/](https://des86532.github.io/devtool-game/)**

### 本地執行

```bash
# 克隆專案
git clone https://github.com/des86532/devtool-game.git

# 進入目錄
cd devtool-game

# 使用任何 HTTP 伺服器執行（例如）
npx serve .
# 或
python -m http.server 8000
```

然後開啟瀏覽器訪問 `http://localhost:8000`（或對應的埠號）。

---

## 💡 關卡攻略指南

### 關卡一：隱形計時器 🕐

**目標**：找出隱藏的真實計時器

**提示**：
1. 開啟 Chrome DevTools（按 `F12` 或 `Ctrl+Shift+I`）
2. 切換到 **Console** 面板
3. 點擊左上角的 **「眼睛」圖示**（Create live expression）
4. 輸入 `window.game.timeLeft` 並按 Enter
5. 觀察數值每秒遞減 - 這就是真實的計時器！

**學習重點**：
- Live Expression 可以即時監控變數變化
- 全域變數可以在 Console 中直接存取

---

### 關卡二：三種資料庫的碎片 🗃️

**目標**：找出分散在三個儲存位置的密碼碎片

**提示**：
1. 開啟 **Application** 面板（或 Chrome 120+ 版本中的 **Storage** 面板）
2. **Cookie**：展開 `Cookies` → 選擇當前網站 → 找到 `Fragment_1`
3. **LocalStorage**：展開 `Local Storage` → 選擇當前網站 → 找到 `Fragment_2`
4. **IndexedDB**：展開 `IndexedDB` → `SecurityDB` → `Secrets` → 點擊 `id: 1` → 查看 `text` 欄位

**學習重點**：
- 瞭解三種瀏覽器儲存機制的差異
- Cookie：小容量、可設定過期時間、自動夾帶在請求中
- LocalStorage：同步存取、5-10MB 容量、Key-Value 結構
- IndexedDB：非同步存取、大容量、支援複雜查詢

---

### 關卡三：渲染壓力測試 ⚡

**目標**：找出導致頁面卡頓的效能問題

**提示**：
1. 開啟 **Rendering** 面板（按 `Ctrl+Shift+P` → 輸入 "Rendering"）
2. 勾選 **Paint flashing**，觀察頁面中閃爍的綠色區域（表示正在重繪）
3. 切換到 **Performance** 面板，點擊錄製按鈕（圓點）
4. 等待 3-5 秒後停止錄製
5. 在時間軸中尋找紅色的 **Long Task**（執行時間超過 50ms）
6. 點擊查看詳細資訊，找出 `heavyDuty()` 函式

**學習重點**：
- Paint Flashing 可視化重繪區域
- 使用 `transform` 而非 `margin`/`top` 來實現動畫（避免 Reflow）
- Long Task 會阻塞主執行緒，影響使用者體驗

---

### 關卡四：網路雜訊過濾 🌐

**目標**：在大量無用請求中找到真正的設定檔

**提示**：
1. 開啟 **Network** 面板
2. 觀察每 200ms 就會發送一次的 `posts/1` 請求（洗版的 heartbeat）
3. 使用 **Filter** 功能：輸入 `users` 來過濾請求
4. 找到 `users/1` 請求，點擊查看 **Response**
5. （進階）嘗試使用 **Throttling** 模擬慢速網路（Slow 3G）
6. （進階）使用 **Request blocking** 封鎖 `posts` 相關的無用請求

**學習重點**：
- 使用 Filter 快速定位目標請求
- Network Throttling 模擬弱網環境
- Request Blocking 測試缺少特定資源時的表現

---

### 關卡五：邏輯劫持 🐛

**目標**：修正程式中的邏輯錯誤

**提示**：
1. 點擊「🔧 拆除炸彈」按鈕
2. 輸入密碼 `DevTools2026`（可在 Console 中查看 `configData.secretPassword`）
3. 發現即使密碼正確，仍然失敗
4. 開啟 **Sources** 面板，按 `Ctrl+P` 搜尋 `index.html`
5. 搜尋 `defuseBomb` 函式（`Ctrl+F`）
6. 在包含 `&& false` 的那一行設置 **Breakpoint**（點擊行號）
7. 再次點擊拆彈按鈕，當程式暫停時，觀察變數 `userCode` 和 `secretCode`
8. **方法一（中斷點）**：在 Scope 中手動修改條件，或跳過該行
9. **方法二（Local Overrides）**：
   - 啟用 **Local Overrides**（Sources 面板左側）
   - 選擇一個本地資料夾作為覆寫位置
   - 直接編輯 `index.html`，刪除 `&& false`
   - 儲存後重新載入頁面

**學習重點**：
- 使用 Breakpoint 暫停程式執行
- 檢查變數與呼叫堆疊
- Local Overrides 允許即時修改生產環境程式碼（用於測試）

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

- **純前端實作**：HTML + CSS + Vanilla JavaScript
- **無需後端**：所有功能均在瀏覽器端完成
- **GitHub Pages 相容**：使用相對路徑，適合靜態部署

### 關卡技術細節

| 關卡 | 涉及技術 | DevTools 面板 |
|------|----------|--------------|
| 關卡一 | 全域變數、setInterval | Console (Live Expression) |
| 關卡二 | Cookie、LocalStorage、IndexedDB | Application / Storage |
| 關卡三 | CSS 動畫、Long Task、Reflow | Performance + Rendering |
| 關卡四 | Fetch API、JSONPlaceholder API | Network |
| 關卡五 | 條件判斷、Breakpoint、Local Overrides | Sources |

### 專案結構

```
devtool-game/
├── index.html          # 主遊戲頁面（包含 CSS 與 JS）
└── README.md           # 本文件
```

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

**專案連結**：[https://github.com/des86532/devtool-game](https://github.com/des86532/devtool-game)

---

<div align="center">

**🎮 準備好接受挑戰了嗎？現在就開始拆彈吧！**

[🚀 開始挑戰](https://des86532.github.io/devtool-game/)

</div>
