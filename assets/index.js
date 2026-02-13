(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) return;
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) processPreload(link);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;
      for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
    }
  }).observe(document, {
    childList: true,
    subtree: true
  });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep) return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
console.log("🚀 系統初始化完成. 任務開始.");
const sceneAudio = new Audio();
sceneAudio.preload = "auto";
sceneAudio.volume = 1;
const baseAssetUrl = (() => {
  const baseEnv = "/conference/";
  return new URL(baseEnv, window.location.origin).href;
})();
const toAssetUrl = (path) => new URL(path, baseAssetUrl).href;
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
function showMessage(type, text) {
  const messageEl = $("#message");
  if (messageEl) {
    messageEl.className = "w-full p-4 mt-4 text-lg font-bold text-center border rounded-lg message";
    if (type === "success") {
      messageEl.classList.add("bg-green-100", "dark:bg-green-900/30", "border-green-500", "text-green-600", "dark:text-green-400");
    } else {
      messageEl.classList.add("bg-red-100", "dark:bg-red-900/30", "border-red-500", "text-red-600", "dark:text-red-400");
    }
    messageEl.textContent = text;
    messageEl.classList.add("active");
    setTimeout(() => messageEl.classList.remove("active"), 5e3);
  }
}
let currentStoryIndex = 0;
let furthestStoryIndex = 0;
const sceneHintsShown = /* @__PURE__ */ new Set();
let story10PasswordAttempted = false;
const story = [
  // === 前言 ===
  {
    id: 0,
    text: "看來這場分享會的命運掌握在你手裡了... 讓我看看你有多少本事。",
    autoNext: false
  },
  {
    id: 1,
    text: "想解除我的炸彈？除非你能看穿這些程式碼的破綻... 小心別讓這裡 <span class='text-red-500 animate-pulse'>爆炸</span> 了",
    autoNext: false
  },
  // === 關卡一：Console ===
  {
    id: 2,
    text: "看看你剩下多少 '時間' 吧！<br>別再手動 log 了... 試著讓你的 Console <span class='text-yellow-400'>『長出一雙眼睛』</span> 來盯著它吧！",
    autoNext: false
  },
  // === 關卡二：Application ===
  {
    id: 3,
    text: "竟然被你發現了真實的時間... 不簡單嘛。<br>但接下來的挑戰可沒那麼直接... 有些 <span class='text-purple-400'>資料</span> 藏在你意想不到的地方...",
    triggerLevel: 1
  },
  {
    id: 4,
    text: "聽說過『資料藏在四面八方』嗎？<br><span class='text-purple-400'>Cookies</span>、<span class='text-purple-400'>Local Storage</span>、<span class='text-purple-400'>Session Storage</span>，甚至 <span class='text-purple-400'>IndexedDB</span>... 每個角落都可能藏著線索。去 <span class='text-purple-400 font-bold'>Application 面板</span> 仔細挖掘吧！",
    autoNext: false
    // 關卡二完成後才能推進到 Story 5
  },
  // === 關卡三：Performance ===
  {
    id: 5,
    text: "竟然被你找到了所有儲存位置... 不過，接下來可沒那麼簡單。<br>感覺到了嗎？你的瀏覽器正在變慢... <span class='text-yellow-400 animate-pulse'>效能</span> 問題可不好解決喔！",
    triggerLevel: 2
  },
  {
    id: 6,
    text: "哈哈，你的頁面卡成這樣... 想知道原因？<br>去 <span class='text-yellow-400 font-bold'>Performance 面板</span> 錄製一段吧！看看是什麼 <span class='text-red-500'>長任務</span> 在拖累你...",
    autoNext: false
    // 關卡三完成後才能推進到 Story 7
  },
  // === 關卡四：Network ===
  {
    id: 7,
    text: "嘖... 連效能瓶頸都被你找到了？<br>那就讓你的網路充滿 <span class='text-green-400'>雜訊</span> 吧！在混亂中，你能找到真正有用的資訊嗎？",
    triggerLevel: 3
  },
  {
    id: 8,
    text: "你應該已經被那些 <span class='text-green-400'>雜訊請求</span> 煩死了吧？<br>試著在 <span class='text-green-400 font-bold'>Network 面板</span> 裡 <span class='text-green-400'>過濾雜訊</span>... 找到成功的請求，它會告訴你下一步該怎麼做...",
    autoNext: false
    // 不設 triggerLevel，讓使用者有時間看提示
  },
  {
    id: 9,
    text: "找到提示了？那就照著做吧！<br>使用 <span class='text-green-400 font-bold'>Local Overrides</span> 來改寫失敗的 API... 成功的話，隱藏的密碼就會浮現...",
    autoNext: false
    // 關卡四完成後才能推進到 Story 10
  },
  // === 關卡五：Sources ===
  // 新增過渡對話 (ID 10)
  {
    id: 10,
    text: "哼，竟然真的被你找到了完整的密碼碎片... <br>不過別得意的太早。<br>既然你這麼有自信，那就<span class='text-red-400 font-bold'>輸入密碼</span>試試看啊？我賭你過不了最後這關！",
    triggerLevel: 4
  },
  // ID 11: 邏輯鎖提示 - 駭客早已預料
  {
    id: 11,
    text: "哈哈哈！驚訝嗎？<br>你以為找到密碼就結束了？太天真了！<br>這是我精心準備的 <span class='text-red-500'>邏輯陷阱</span>。<br>想解開它？去 <span class='text-yellow-400 font-bold'>Sources 面板</span> 看看你能做什麼吧！",
    autoNext: false
  },
  // === 最終勝利 ===
  {
    id: 12,
    text: "不可能... 我的邏輯鎖... 竟然被破解了？！<br><span class='text-green-500 text-xl font-bold'>🎉 恭喜！你已成功守護了這場分享會！</span>",
    triggerLevel: 5,
    // 只有完成關卡五後才能到達
    isFinal: true
  }
];
function updateVillainMessage(text) {
  const desktopMsg = $("#desktop-villain-msg");
  const mobileMsg = $("#mobile-villain-msg");
  const formattedText = `<span class="text-green-500 font-bold mr-2">&gt;</span>"${text}"`;
  if (desktopMsg) desktopMsg.innerHTML = formattedText;
  if (mobileMsg) mobileMsg.innerHTML = formattedText;
}
function playSceneAudio(scene) {
  if (!scene || scene.id === void 0 || scene.id === null) return;
  sceneAudio.pause();
  sceneAudio.currentTime = 0;
  sceneAudio.src = toAssetUrl(`audio/id-${scene.id}.mp3`);
  sceneAudio.play().catch(() => {
  });
}
function logSceneHints(sceneId) {
  switch (sceneId) {
    case 2:
      console.log("%c💡 駭客提示:", "color: #fbbf24; font-size: 16px; font-weight: bold;");
      console.log("%c試著在 Console 面板找到「眼睛圖示」👁️ (Create Live Expression)", "color: #60a5fa; font-size: 14px;");
      console.log("%c然後輸入這個變數來監控時間:", "color: #a78bfa; font-size: 14px;");
      console.log("%cwindow.game.timer", "color: #10b981; font-size: 18px; font-weight: bold; background: #1f2937; padding: 8px; border-radius: 4px;");
      console.log("%c💡 提示: Live Expression 會即時更新數值，不用一直重新輸入！", "color: #fbbf24; font-size: 12px; font-style: italic;");
      break;
    case 4:
      console.log("%c💡 駭客提示:", "color: #fbbf24; font-size: 16px; font-weight: bold;");
      console.log("%c密碼碎片分散在 4 個儲存位置，每個位置藏著一個提示...", "color: #a78bfa; font-size: 14px;");
      console.log("%c檢查以下位置（Application 面板）:", "color: #60a5fa; font-size: 14px;");
      console.log("%c  1. Cookies", "color: #10b981; font-size: 13px;");
      console.log("%c  2. Local Storage", "color: #10b981; font-size: 13px;");
      console.log("%c  3. Session Storage", "color: #10b981; font-size: 13px;");
      console.log("%c  4. IndexedDB (database: DevToolsDB)", "color: #10b981; font-size: 13px;");
      console.log("%c找到 4 個提示後，組合起來並在 Console 驗證:", "color: #a78bfa; font-size: 14px;");
      console.log('%cwindow.game.verifyLevel2("你組合的完整碎片")', "color: #10b981; font-size: 16px; font-weight: bold; background: #1f2937; padding: 8px; border-radius: 4px;");
      break;
    case 6:
      console.log("%c💡 駭客提示:", "color: #fbbf24; font-size: 16px; font-weight: bold;");
      console.log("%c頁面卡頓？試試 Performance 面板！", "color: #60a5fa; font-size: 14px;");
      console.log("%c步驟:", "color: #a78bfa; font-size: 14px;");
      console.log("%c  1. 開啟 Performance 面板", "color: #10b981; font-size: 13px;");
      console.log("%c  2. 點擊錄製按鈕（圓點圖示）", "color: #10b981; font-size: 13px;");
      console.log("%c  3. 等待 3-5 秒後停止", "color: #10b981; font-size: 13px;");
      console.log("%c  4. 尋找紅色的 Long Task（超過 50ms 的任務）", "color: #10b981; font-size: 13px;");
      console.log("%c  5. 點擊該任務，在 Summary 標籤中點擊函式名稱（跳轉到 Sources）", "color: #10b981; font-size: 13px;");
      console.log("%c  6. 查看它的程式碼註釋，解法就藏在那裡...", "color: #fbbf24; font-size: 14px; font-weight: bold;");
      break;
    case 8:
      console.log("%c💡 駭客提示:", "color: #fbbf24; font-size: 16px; font-weight: bold;");
      console.log("%c開啟 Network 面板，觀察那些頻繁的 request...", "color: #60a5fa; font-size: 14px;");
      console.log("%c步驟:", "color: #a78bfa; font-size: 14px;");
      console.log("%c  1. 右鍵點擊雜訊請求 → Block request URL/domain", "color: #10b981; font-size: 13px;");
      console.log("%c  2. 找到成功的 API，查看 Response...", "color: #fbbf24; font-size: 14px;");
      break;
    case 9:
      console.log("%c💡 駭客提示:", "color: #fbbf24; font-size: 16px; font-weight: bold;");
      console.log("%c使用 Local Overrides 來改寫 API response！", "color: #60a5fa; font-size: 14px;");
      console.log("%c步驟:", "color: #a78bfa; font-size: 14px;");
      console.log("%c  1. Sources 面板 → Overrides → Enable Local Overrides", "color: #10b981; font-size: 13px;");
      console.log("%c  2. Network 面板 → 找到目標 API → 右鍵 → Override content", "color: #10b981; font-size: 13px;");
      console.log("%c  3. 編輯內容讓 API 成功返回（參考提示檔的說明）", "color: #10b981; font-size: 13px;");
      console.log("%c  4. 重新載入頁面，看看會發生什麼...", "color: #fbbf24; font-size: 14px; font-weight: bold;");
      break;
    case 11:
      console.clear();
      console.error("❌ Access Denied: Logic Verification Failed");
      console.warn("⚠️ 系統提示: 檢測到異常的邏輯判斷。");
      console.info("💡 Debug 指引: 請在 Sources 面板中檢查 `submitPassword` 函式，尋找 `isSystemIntegrityCheckPassed` 變數。");
      break;
  }
}
function canAdvanceTo(index) {
  if (index <= currentStoryIndex || index >= story.length) return false;
  const nextScene = story[index];
  if (!nextScene) return false;
  if (nextScene.triggerLevel) {
    const level = challenges.find((c) => c.id === nextScene.triggerLevel);
    if (!level || !level.completed) return false;
  }
  if (nextScene.triggerLevels) {
    const anyCompleted = nextScene.triggerLevels.some((levelId) => {
      const level = challenges.find((c) => c.id === levelId);
      return level && level.completed;
    });
    if (!anyCompleted) return false;
  }
  return true;
}
function canAdvanceFromCurrent() {
  const nextIndex = currentStoryIndex + 1;
  if (currentStoryIndex === 10 && nextIndex === 11 && !story10PasswordAttempted) {
    return false;
  }
  if (nextIndex <= furthestStoryIndex) return nextIndex < story.length;
  return canAdvanceTo(nextIndex);
}
function syncNavigation() {
  const desktopNext = $("#desktop-next-btn");
  const mobileNext = $("#mobile-next-btn");
  const desktopPrev = $("#desktop-prev-btn");
  const mobilePrev = $("#mobile-prev-btn");
  const canGoPrev = currentStoryIndex > 0;
  const canGoNext = canAdvanceFromCurrent();
  [desktopPrev, mobilePrev].forEach((btn) => {
    if (btn) {
      btn.dataset.active = canGoPrev;
      btn.disabled = !canGoPrev;
    }
  });
  [desktopNext, mobileNext].forEach((btn) => {
    if (btn) {
      btn.dataset.active = canGoNext;
      btn.disabled = !canGoNext;
    }
  });
}
function handleSceneEntry(scene) {
  if (!scene) return;
  updateVillainMessage(scene.text);
  playSceneAudio(scene);
  if (!sceneHintsShown.has(scene.id)) {
    sceneHintsShown.add(scene.id);
    logSceneHints(scene.id);
  }
  syncNavigation();
}
window.advanceNarrative = function() {
  const nextIndex = currentStoryIndex + 1;
  if (nextIndex >= story.length) return;
  if (nextIndex > furthestStoryIndex && !canAdvanceTo(nextIndex)) return;
  currentStoryIndex = nextIndex;
  furthestStoryIndex = Math.max(furthestStoryIndex, currentStoryIndex);
  handleSceneEntry(story[currentStoryIndex]);
};
window.retreatNarrative = function() {
  if (currentStoryIndex === 0) return;
  currentStoryIndex--;
  handleSceneEntry(story[currentStoryIndex]);
};
function checkNarrativeTrigger(levelId) {
  const scene = story[currentStoryIndex];
  const isTriggered = scene.triggerLevel === levelId || scene.triggerLevels && scene.triggerLevels.includes(levelId);
  if (scene && isTriggered) {
    syncNavigation();
    showMessage("success", "駭客已被逼入絕境！點擊右下角箭頭繼續追擊！");
  }
}
let isSidebarExpanded = false;
window.toggleSidebar = function() {
  isSidebarExpanded = !isSidebarExpanded;
  const sidebar = $("#mission-sidebar");
  const icon = $("#sidebar-icon");
  if (isSidebarExpanded) {
    sidebar.classList.remove("-translate-x-full");
    sidebar.classList.add("translate-x-0");
    icon.textContent = "chevron_left";
  } else {
    sidebar.classList.add("-translate-x-full");
    sidebar.classList.remove("translate-x-0");
    icon.textContent = "chevron_right";
  }
};
const challenges = [
  {
    id: 1,
    title: "隱形計時器",
    desc: "Console 面板",
    icon: "terminal",
    color: "blue",
    fragment: "Dev",
    completed: false,
    hint: '開啟 Console，點擊眼睛圖示 (Create Live Expression)，輸入 "window.game.timer"',
    knowledge: `
            <h2 class="text-2xl font-bold text-blue-400 mb-4">Console: Log Methods & Live Expressions</h2>
            
            <div class="mb-4">
                <h3 class="text-lg font-semibold text-gray-200 mb-2">🎯 核心概念：動態觀測 vs 靜態紀錄</h3>
                <p class="text-gray-400">Console 不僅僅是 log 的輸出地。透過不同的工具，我們可以選擇觀察 "當下瞬間" 的狀態，或是 "持續監控" 數值的變化。</p>
            </div>
            
            <div class="mb-4">
                <h3 class="text-lg font-semibold text-gray-200 mb-2">⚖️ 同性質比較：觀測方式差異</h3>
                <ul class="list-disc list-inside text-gray-400 space-y-1">
                    <li><strong>console.log()：</strong>靜態快照。紀錄的是程式執行那一瞬間的變數狀態（但要注意物件參考特性），適合查看歷史軌跡。</li>
                    <li><strong>Live Expression (眼睛圖示)：</strong>動態監控。表達式會釘選在 Console 頂部，隨時自動更新並顯示"當前最新"的值，適合監控變化的狀態（如計時器、座標）。</li>
                </ul>
            </div>
        `
  },
  {
    id: 2,
    title: "碎片搜尋",
    desc: "Application 面板",
    icon: "storage",
    color: "purple",
    fragment: "Tools",
    completed: false,
    hint: '密碼碎片分散在 4 個儲存位置：Cookies、Local Storage、Session Storage、IndexedDB。收集 4 個提示並組合成完整碎片，然後呼叫 window.game.verifyLevel2("碎片") 驗證',
    knowledge: `
            <h2 class="text-2xl font-bold text-purple-400 mb-4">Application: Storage Strategies</h2>
            
            <div class="mb-4">
                <h3 class="text-lg font-semibold text-gray-200 mb-2">🎯 核心概念：客戶端儲存機制</h3>
                <p class="text-gray-400">瀏覽器提供了多種儲存資料的方式，每種方式都有其特定的用途、容量限制與生命週期。</p>
            </div>
            
            <div class="mb-4">
                <h3 class="text-lg font-semibold text-gray-200 mb-2">⚖️ 同性質比較：儲存方案差異</h3>
                <ul class="list-disc list-inside text-gray-400 space-y-1">
                    <li><strong>Cookies：</strong>容量極小 (4KB)，每次 HTTP 請求都會自動夾帶，主要用於伺服器驗證與狀態維持。</li>
                    <li><strong>Local Storage：</strong>容量較大 (5-10MB)，永久儲存直到被清除，純客戶端存取，適合儲存使用者偏好設定。</li>
                    <li><strong>Session Storage：</strong>容量同 Local Storage，但生命週期僅限於「當前分頁」。分頁關閉即消失，適合暫存表單資料。</li>
                    <li><strong>IndexedDB：</strong>非同步、物件導向的資料庫。容量大且支援索引與交易 (Transaction)，適合儲存離線應用 (PWA) 的大量結構化資料。</li>
                </ul>
            </div>
        `
  },
  {
    id: 3,
    title: "渲染壓力",
    desc: "Performance 面板",
    icon: "speed",
    color: "yellow",
    fragment: "20",
    completed: false,
    hint: "開啟 Performance 面板錄製，找出長條的紅色 task，尋找 window.stopLag() 函式",
    knowledge: `
            <h2 class="text-2xl font-bold text-yellow-400 mb-4">Performance: Runtime Metrics</h2>
            
            <div class="mb-4">
                <h3 class="text-lg font-semibold text-gray-200 mb-2">🎯 核心概念：執行成本分析 (Flame Chart)</h3>
                <p class="text-gray-400">效能面板的火焰圖透過顏色區分不同的瀏覽器工作。優化的第一步是識別哪種顏色的工作佔用了主執行緒 (Main Thread) 的時間。</p>
            </div>
            
            <div class="mb-4">
                <h3 class="text-lg font-semibold text-gray-200 mb-2">⚖️ 同性質比較：任務類型 (顏色) 差異</h3>
                <ul class="list-disc list-inside text-gray-400 space-y-1">
                    <li><strong><span class="text-yellow-400">黃色 (Scripting)</span>：</strong>JavaScript 執行。包含事件處理、API 呼叫、邏輯運算。優化方向：Code Splitting, Web Workers, 演算法優化。</li>
                    <li><strong><span class="text-purple-400">紫色 (Rendering)</span>：</strong>樣式計算 (Recalculate Style) 與佈局 (Layout/Reflow)。優化方向：減少 DOM 操作, 避免 Layout Thrashing。</li>
                    <li><strong><span class="text-green-400">綠色 (Painting)</span>：</strong>繪製與合成 (Paint & Composite)。優化方向：使用已提升的圖層 (GPU 加速), 減少重繪區域。</li>
                </ul>
            </div>
        `
  },
  {
    id: 4,
    title: "網路雜訊",
    desc: "Network 面板",
    icon: "wifi",
    color: "green",
    fragment: "26",
    completed: false,
    hint: "步驟：1) Block 頻繁的雜訊請求 2) 找到成功的 hint-override.json，查看 Response 3) 使用 Local Overrides override /secret-data.json 4) 重新載入頁面，隱藏碎片會出現",
    knowledge: `
            <h2 class="text-2xl font-bold text-green-400 mb-4">Network: Request Interception</h2>
            
            <div class="mb-4">
                <h3 class="text-lg font-semibold text-gray-200 mb-2">🎯 核心概念：網路行為修改</h3>
                <p class="text-gray-400">不需等待後端 API 修改，前端開發者可以直接在瀏覽器層面介入與修改網路請求，以模擬各種情境。</p>
            </div>
            
            <div class="mb-4">
                <h3 class="text-lg font-semibold text-gray-200 mb-2">⚖️ 同性質比較：介入策略差異</h3>
                <ul class="list-disc list-inside text-gray-400 space-y-1">
                    <li><strong>Block Request URL (阻擋)：</strong>完全阻止請求發送。模擬資源遺失、伺服器掛掉或是第三方追蹤腳本被阻擋的情境。(破壞性測試)</li>
                    <li><strong>Network Throttling (節流)：</strong>限制頻寬與延遲。模擬 3G/4G 慢速網路或離線狀態，測試載入體驗與 Timeout 處理。(效能測試)</li>
                    <li><strong>Local Overrides (覆寫)：</strong>攔截請求並返回本地定義的內容。模擬 API 回傳特定資料（如錯誤訊息、特定邊界值），從而測試前端邏輯。(功能測試/Mocking)</li>
                </ul>
            </div>
        `
  },
  {
    id: 5,
    title: "邏輯劫持",
    desc: "Sources 面板",
    icon: "code",
    color: "red",
    fragment: null,
    completed: false,
    hint: "這一步沒有密碼碎片，你的任務是讓 [緊急解除] 按鈕生效。開啟 Sources 面板，Debug submitPassword 函式。",
    knowledge: `
            <h2 class="text-2xl font-bold text-red-500 mb-4">Sources: Breakpoint Strategies</h2>
            
            <div class="mb-4">
                <h3 class="text-lg font-semibold text-gray-200 mb-2">🎯 核心概念：中斷點類型</h3>
                <p class="text-gray-400">Debug 不只是在某一行暫停。善用不同類型的斷點，可以精準捕捉問題發生的瞬間，過濾不必要的雜訊。</p>
            </div>
            
            <div class="mb-4">
                <h3 class="text-lg font-semibold text-gray-200 mb-2">⚖️ 同性質比較：斷點觸發時機</h3>
                <ul class="list-disc list-inside text-gray-400 space-y-1">
                    <li><strong>Line Breakpoint (行斷點)：</strong>最基礎的斷點。執行到該行程式碼時暫停。</li>
                    <li><strong>Conditional Breakpoint (條件斷點)：</strong>"只有當..."才暫停。例如 <code>id === 'bug'</code>。適合在迴圈或頻繁觸發的事件中過濾雜訊，大幅節省 Debug 時間。</li>
                    <li><strong>DOM Breakpoint：</strong>當 HTML 元素被修改（屬性變更、子節點移除）時暫停。適合尋找 "是誰偷偷改了我的介面？" 的 UI Bug。</li>
                    <li><strong>XHR/Fetch Breakpoint：</strong>當特定 URL 的網路請求發送時暫停。適合追蹤請求發送的起點與堆疊。</li>
                </ul>
            </div>
        `
  }
];
function renderChallenges() {
  const lists = $$(".challenge-list");
  if (!lists.length) return;
  const htmlContent = challenges.map((c) => `
        <div class="challenge-item p-3 rounded border-l-2 font-mono text-xs text-gray-300 hover:bg-${c.color}-900/10 transition-all duration-300 flex justify-between items-center group ${c.completed ? `bg-green-900/20 border-green-500 opacity-80` : `bg-[#1f242d] border-${c.color}-500`}" data-id="${c.id}">
            <div class="flex-grow">
                <div class="flex items-center gap-2 mb-1 text-gray-500 text-[10px]">
                    <span class="material-icons text-[10px] ${c.completed ? "text-green-500" : ""}">${c.icon}</span> 
                    LEVEL ${c.id}
                </div>
                <div class="font-bold text-${c.color}-300">${c.title}</div>
                <div class="text-[10px] opacity-70">${c.desc}</div>
                ${c.completed && c.fragment ? `<div class="mt-1 text-green-400 font-bold bg-black/30 inline-block px-1 rounded">碎片: ${c.fragment}</div>` : ""}
            </div>
            
            <div class="flex gap-1 opacity-100 group-hover:opacity-100 transition-opacity">
                 <button onclick="showHint(${c.id})" class="p-1.5 hover:bg-white/10 rounded text-yellow-500" title="提示">
                    <span class="material-icons text-sm">lightbulb</span>
                 </button>
                 <button onclick="openKnowledge(${c.id})" class="p-1.5 hover:bg-white/10 rounded text-blue-400" title="知識點">
                    <span class="material-icons text-sm">menu_book</span>
                 </button>
                 <div class="w-6 flex items-center justify-center">
                    ${c.completed ? '<span class="material-icons text-green-500 text-sm animate-bounce">check_circle</span>' : ""}
                 </div>
            </div>
        </div>
    `).join("");
  lists.forEach((list) => {
    list.innerHTML = htmlContent;
  });
}
function markChallengeComplete(id) {
  const challenge = challenges.find((c) => c.id === id);
  if (challenge && !challenge.completed) {
    challenge.completed = true;
    renderChallenges();
    checkNarrativeTrigger(id);
    syncNavigation();
    if (id === 1) {
      updateTimerDisplay();
    } else if (id === 2) {
      scheduleLagSequence();
    } else if (id === 3) {
      startNetworkChaos();
    }
    if (challenge.fragment) {
      showMessage("success", `取得密碼碎片: [ ${challenge.fragment} ]`);
    }
  }
}
window.openKnowledge = function(id) {
  const challenge = challenges.find((c) => c.id === id);
  if (!challenge) return;
  const modal = $("#knowledge-modal");
  const content = $("#modal-content");
  content.innerHTML = challenge.knowledge;
  modal.classList.remove("hidden", "pointer-events-none");
  setTimeout(() => modal.classList.remove("opacity-0"), 10);
  modal.querySelector("div").classList.remove("scale-95");
  modal.querySelector("div").classList.add("scale-100");
};
window.closeModal = function() {
  const modal = $("#knowledge-modal");
  modal.classList.add("opacity-0");
  modal.querySelector("div").classList.add("scale-95");
  modal.querySelector("div").classList.remove("scale-100");
  setTimeout(() => modal.classList.add("hidden", "pointer-events-none"), 300);
};
window.closeModalOnBackdrop = function(event) {
  if (event.target.id === "knowledge-modal") {
    closeModal();
  }
};
window.showHint = function(id) {
  const challenge = challenges.find((c) => c.id === id);
  if (challenge) showMessage("info", `提示: ${challenge.hint}`);
};
function formatTime(totalSeconds) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds || 0));
  const hours = String(Math.floor(safeSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor(safeSeconds % 3600 / 60)).padStart(2, "0");
  const seconds = String(safeSeconds % 60).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}
function generateFakeTime() {
  const glitchTokens = ["##", "??", "--", "88", "!!", "%%"];
  const segment = () => {
    if (Math.random() > 0.6) {
      return glitchTokens[Math.floor(Math.random() * glitchTokens.length)];
    }
    return String(Math.floor(Math.random() * 90)).padStart(2, "0");
  };
  return `${segment()}:${segment()}:${segment()}`;
}
function updateTimerDisplay(overrideText) {
  const timerEl = $("#timer");
  if (!timerEl) return;
  let displayText = overrideText;
  if (!displayText) {
    const levelOne = challenges.find((c) => c.id === 1);
    if (levelOne && levelOne.completed) {
      displayText = formatTime(window.game._internalTimer);
    } else {
      displayText = generateFakeTime();
    }
  }
  timerEl.textContent = displayText;
  timerEl.dataset.text = displayText;
}
window.game = { timeLeft: 1200, _internalTimer: 1200 };
window.game.foundFragment = function(levelId, password) {
  const challenge = challenges.find((c) => c.id === levelId);
  if (!challenge) {
    console.log("%c❌ 錯誤: 無效的關卡 ID", "color: #ef4444; font-size: 14px; font-weight: bold;");
    return;
  }
  if (challenge.completed) {
    console.log(`%c✅ 關卡 ${levelId} 已經完成了！`, "color: #10b981; font-size: 14px;");
    return;
  }
  if (password !== challenge.fragment) {
    console.log("%c❌ 密碼錯誤！", "color: #ef4444; font-size: 16px; font-weight: bold;");
    console.log(`%c提示: 仔細檢查 ${challenge.desc} 中的資料...`, "color: #f59e0b; font-size: 14px;");
    return;
  }
  console.log("%c🎉 答對了！", "color: #10b981; font-size: 18px; font-weight: bold;");
  console.log(`%c碎片已記錄: ${password}`, "color: #3b82f6; font-size: 14px; background: #1f2937; padding: 4px 8px; border-radius: 4px;");
  markChallengeComplete(levelId);
};
let observation = { count: 0, lastTime: 0, isConfirmed: false };
Object.defineProperty(window.game, "timer", {
  get: function() {
    const now = Date.now();
    if (now - observation.lastTime < 500) observation.count++;
    else observation.count = 1;
    observation.lastTime = now;
    if (observation.count >= 5 && !observation.isConfirmed) {
      observation.isConfirmed = true;
      console.log("%c 🎉 偵測成功！取得碎片: Dev", "color: #00ff00; font-size: 16px;");
      markChallengeComplete(1);
    }
    return this._internalTimer;
  }
});
setInterval(() => {
  if (window.game._internalTimer > 0) window.game._internalTimer--;
  updateTimerDisplay();
}, 1e3);
const perfIndicator = $("#performance-indicator");
const fuseSparkEl = document.getElementById("fuse-spark");
let lagSequenceScheduled = false;
if (perfIndicator) {
  let animateIndicator = function() {
    const now = Date.now();
    const elapsed = now - startTime;
    const cycleTime = elapsed % (duration * 2);
    let progress;
    let isForward = cycleTime < duration;
    if (isForward) {
      progress = cycleTime / duration;
    } else {
      progress = 1 - (cycleTime - duration) / duration;
    }
    const easedProgress = 0.5 * (1 - Math.cos(progress * Math.PI));
    const translateX = -180 + 360 * easedProgress;
    const rotation = 360 * easedProgress;
    perfIndicator.style.transform = `translate(-50%, -50%) translateX(${translateX}px) rotate(${rotation}deg)`;
    perfIndicator.style.animation = "none";
    requestAnimationFrame(animateIndicator);
  };
  perfIndicator.style.opacity = "0.8";
  perfIndicator.classList.remove("pointer-events-none");
  const startTime = Date.now();
  const duration = 3e3;
  requestAnimationFrame(animateIndicator);
}
function scheduleLagSequence() {
  if (lagSequenceScheduled) return;
  lagSequenceScheduled = true;
  setTimeout(() => {
    if (typeof window.startLag === "function") {
      window.startLag();
    }
  }, 800);
}
window.startLag = function() {
  if (fuseSparkEl) {
    fuseSparkEl.classList.add("lag-active");
  }
  window.lagInterval = setInterval(() => {
  }, 200);
};
window.stopLag = function() {
  clearInterval(window.lagInterval);
  if (fuseSparkEl) {
    fuseSparkEl.classList.remove("lag-active");
    fuseSparkEl.classList.add("fixed-state");
  }
  if (perfIndicator) {
    perfIndicator.style.borderColor = "#10b981";
    perfIndicator.style.boxShadow = "0 0 15px #10b981";
  }
  console.log("✅ 效能優化完成！取得碎片: 20");
  markChallengeComplete(3);
};
async function initIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("DevToolsDB", 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(["hints"], "readwrite");
      const store = transaction.objectStore("hints");
      store.put({ id: "hint_4", value: "ls" });
      transaction.oncomplete = () => {
        db.close();
        resolve();
      };
    };
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("hints")) {
        db.createObjectStore("hints", { keyPath: "id" });
      }
    };
  });
}
function initStorage() {
  document.cookie = `hint_1=T; path=/`;
  localStorage.setItem("hint_2", "o");
  sessionStorage.setItem("hint_3", "o");
  initIndexedDB().catch((err) => console.error("IndexedDB init failed:", err));
}
window.game.verifyLevel2 = function(answer) {
  const correctAnswer = "Tools";
  if (challenges[1].completed) {
    console.log("%c✅ 關卡二已經完成了！", "color: #10b981; font-size: 14px;");
    return;
  }
  if (answer !== correctAnswer) {
    console.log("%c❌ 答案錯誤！", "color: #ef4444; font-size: 16px; font-weight: bold;");
    console.log("%c請確認你已經找到所有 4 個儲存位置的提示...", "color: #f59e0b; font-size: 13px;");
    return;
  }
  console.log("%c🎉 答對了！", "color: #10b981; font-size: 18px; font-weight: bold;");
  console.log("%c碎片已記錄: Tools", "color: #3b82f6; font-size: 14px; background: #1f2937; padding: 4px 8px; border-radius: 4px;");
  markChallengeComplete(2);
};
let noiseInterval;
let secretDataInterval;
let networkChaosStarted = false;
window.isSystemIntegrityCheckPassed = window.isSystemIntegrityCheckPassed || false;
function startNetworkChaos() {
  if (networkChaosStarted) return;
  networkChaosStarted = true;
  noiseInterval = setInterval(() => {
    fetch(toAssetUrl("noise-signal-404.json")).then(() => {
    }).catch(() => {
      console.log("%c🎉 雜訊已消除！(偵測到 Network Block)", "color: #10b981; font-size: 14px; font-weight: bold;");
      clearInterval(noiseInterval);
      console.log("%c💡 雜訊消除，關鍵訊號浮現...", "color: #fbbf24; font-size: 14px;");
      setTimeout(() => {
        fetch(toAssetUrl("hint-override.json")).then((r) => r.json()).then(() => {
        }).catch(() => {
        });
      }, 1e3);
    });
  }, 300);
  secretDataInterval = setInterval(async () => {
    try {
      const res = await fetch(toAssetUrl("secret-data.json"));
      if (res.ok) {
        const data = await res.json();
        if (data.status === "unlocked" && data.SECRET_CODE_FRAGMENT) {
          const hiddenFragment = document.getElementById("hidden-fragment");
          if (hiddenFragment && hiddenFragment.classList.contains("hidden")) {
            hiddenFragment.classList.remove("hidden");
            console.log("%c🎉 API Override 成功！", "color: #10b981; font-size: 16px; font-weight: bold;");
            console.log("%c隱藏的碎片已經出現在頁面上了！", "color: #60a5fa; font-size: 14px;");
            showMessage("success", `成功解除鎖定！取得密碼碎片: [ ${data.SECRET_CODE_FRAGMENT} ]`);
            clearInterval(secretDataInterval);
          }
        }
      }
    } catch (e) {
    }
  }, 5e3);
}
window.submitPassword = function() {
  const input = $("#password-input");
  const val = input.value.trim();
  const correctPass = "DevTools2026";
  if (currentStoryIndex === 10) {
    story10PasswordAttempted = true;
    if (furthestStoryIndex < 11) {
      furthestStoryIndex = 11;
      syncNavigation();
    }
  }
  if (val !== correctPass) {
    showMessage("error", "密碼錯誤！請檢查各關卡收集到的碎片 (Dev...Tools...20...26)");
    input.classList.add("animate-shake");
    setTimeout(() => input.classList.remove("animate-shake"), 500);
    return;
  }
  if (window.isSystemIntegrityCheckPassed) {
    markChallengeComplete(5);
    showMessage("success", "🎉 系統解鎖成功！炸彈已拆除！");
    const timerEl = $("#timer");
    if (timerEl) timerEl.classList.add("text-green-500");
    updateTimerDisplay("DEFUSED");
    input.disabled = true;
    input.classList.add("text-green-500", "border-green-500");
    $("#defuse-btn").classList.add("bg-green-500", "hover:bg-green-600");
    const finalStoryIndex = 12;
    furthestStoryIndex = Math.max(furthestStoryIndex, finalStoryIndex);
    syncNavigation();
  } else {
    if (currentStoryIndex === 10) {
      story10PasswordAttempted = true;
      if (furthestStoryIndex < 11) {
        furthestStoryIndex = 11;
        syncNavigation();
        showMessage("error", "❌ 驗證失敗... 但似乎觸發了什麼？(點擊右下角箭頭繼續)");
      } else {
        showMessage("error", "❌ 驗證失敗... (請點擊右下角箭頭繼續)");
      }
    } else if (currentStoryIndex === 11) {
      showMessage("error", "❌ 錯誤：系統邏輯較驗失敗！");
    }
  }
};
document.addEventListener("keydown", function(e) {
  const target = e.target;
  const isEditable = target && (target.isContentEditable || target.tagName === "INPUT" || target.tagName === "TEXTAREA");
  if (isEditable) return;
  if (e.key === "Escape") {
    const modal = $("#knowledge-modal");
    if (modal && !modal.classList.contains("hidden")) {
      e.preventDefault();
      closeModal();
      return;
    }
  }
  if (e.key === "ArrowRight") {
    if (canAdvanceFromCurrent()) {
      e.preventDefault();
      advanceNarrative();
    }
  } else if (e.code === "Space") {
    e.preventDefault();
    playSceneAudio(story[currentStoryIndex]);
  } else if (e.key === "ArrowLeft") {
    if (currentStoryIndex > 0) {
      e.preventDefault();
      window.retreatNarrative();
    }
  }
});
window.addEventListener("DOMContentLoaded", () => {
  renderChallenges();
  initStorage();
  handleSceneEntry(story[0]);
  updateTimerDisplay();
  $("#password-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") window.submitPassword();
  });
});
//# sourceMappingURL=index.js.map
