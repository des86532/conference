// ==================== Game Initialization ====================
console.log('🚀 系統初始化完成. 任務開始.');

// Helper for selecting elements
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector); // For multiple lists

// Messaging System
function showMessage(type, text) {
    const messageEl = $('#message');
    
    if (messageEl) {
        messageEl.className = 'message w-full p-4 rounded-lg border text-center font-bold text-lg mt-4';
        if (type === 'success') {
            messageEl.classList.add('bg-green-100', 'dark:bg-green-900/30', 'border-green-500', 'text-green-600', 'dark:text-green-400');
        } else {
            messageEl.classList.add('bg-red-100', 'dark:bg-red-900/30', 'border-red-500', 'text-red-600', 'dark:text-red-400');
        }
        messageEl.textContent = text;
        messageEl.classList.add('active');
        setTimeout(() => messageEl.classList.remove('active'), 5000);
    }
}

// ==================== Narrative System ====================
let currentStoryIndex = 0;
const story = [
    { 
        id: 0, 
        text: "看來這棟大樓的命運掌握在你手裡了... 讓我看看你有多少本事。", 
        autoNext: false 
    },
    { 
        id: 1, 
        text: "想解除我的炸彈？除非你能看穿這些程式碼的破綻... 小心別讓這裡 <span class='text-red-500 animate-pulse'>爆炸</span> 了", 
        autoNext: false
    },
    { 
        id: 2, 
        text: "看看你剩下多少 '時間' 吧！<br>別再手動 log 了... 試著讓你的 Console <span class='text-yellow-400'>『長出一雙眼睛』</span> 來盯著它吧！", 
        triggerLevel: 1 
    },
    { 
        id: 3, 
        text: "竟然被你發現了... 但這只是開始。<br>有些秘密藏在你看不到的地方 (Application/Network)... 繼續找啊！", 
        triggerLevels: [2, 4] // 完成 Level 2 或 Level 4 任一即可解鎖
    },
    {
        id: 4,
        text: "嘖... 連效能隱藏都被你抓到了？<br>最後一道防線可沒那麼簡單。去 Sources 面板看看你的『解除按鈕』壞在哪裡吧！",
        triggerLevel: 5 
    },
    {
        id: 5,
        text: "不可能... 我的邏輯鎖... 竟然被破解了？！<br><span class='text-green-500'>恭喜！你已成功守護了這場大會！</span>",
        isFinal: true
    }
];

function updateVillainMessage(text) {
    const desktopMsg = $('#desktop-villain-msg');
    const mobileMsg = $('#mobile-villain-msg');
    const formattedText = `<span class="text-green-500 font-bold mr-2">&gt;</span>"${text}"`;
    
    if (desktopMsg) desktopMsg.innerHTML = formattedText;
    if (mobileMsg) mobileMsg.innerHTML = formattedText;
}

function updateNextButton(show) {
    const dBtn = $('#desktop-next-btn');
    const mBtn = $('#mobile-next-btn');
    if (dBtn) dBtn.dataset.active = show;
    if (mBtn) mBtn.dataset.active = show;
}

window.advanceNarrative = function() {
    if (currentStoryIndex < story.length - 1) {
        currentStoryIndex++;
        const scene = story[currentStoryIndex];
        updateVillainMessage(scene.text);
        
        // Story ID 2: 引導使用者使用 Live Expression
        if (scene.id === 2) {
            console.log('%c💡 駭客提示:', 'color: #fbbf24; font-size: 16px; font-weight: bold;');
            console.log('%c試著在 Console 面板找到「眼睛圖示」👁️ (Create Live Expression)', 'color: #60a5fa; font-size: 14px;');
            console.log('%c然後輸入這個變數來監控時間:', 'color: #a78bfa; font-size: 14px;');
            console.log('%cwindow.game.timer', 'color: #10b981; font-size: 18px; font-weight: bold; background: #1f2937; padding: 8px; border-radius: 4px;');
            console.log('%c💡 提示: Live Expression 會即時更新數值，不用一直重新輸入！', 'color: #fbbf24; font-size: 12px; font-style: italic;');
        }
        
        // Story ID 3: 引導使用者驗證 Application 和 Network 的碎片
        if (scene.id === 3) {
            console.log('%c💡 駭客提示:', 'color: #fbbf24; font-size: 16px; font-weight: bold;');
            console.log('%c有些密碼碎片藏在 Application 和 Network 面板中...', 'color: #60a5fa; font-size: 14px;');
            console.log('%c找到碎片後，記得回到 Console 確認:', 'color: #a78bfa; font-size: 14px;');
            console.log('%cwindow.game.foundFragment(2, "你找到的密碼")  // Level 2: Application', 'color: #10b981; font-size: 13px; background: #1f2937; padding: 4px; border-radius: 4px;');
            console.log('%cwindow.game.foundFragment(4, "你找到的密碼")  // Level 4: Network', 'color: #10b981; font-size: 13px; background: #1f2937; padding: 4px; border-radius: 4px;');
            console.log('%c💡 提示: Cookies、LocalStorage、Network 請求... 到處都可能藏著線索！', 'color: #fbbf24; font-size: 12px; font-style: italic;');
        }
        
        
        // 判斷是否顯示 Next 箭頭
        if (scene.triggerLevel) {
            // 單一觸發條件
            const level = challenges.find(c => c.id === scene.triggerLevel);
            if (level && level.completed) updateNextButton(true);
            else updateNextButton(false);
        } else if (scene.triggerLevels) {
            // 多重觸發條件：檢查是否有任一關卡完成
            const anyCompleted = scene.triggerLevels.some(levelId => {
                const level = challenges.find(c => c.id === levelId);
                return level && level.completed;
            });
            updateNextButton(anyCompleted);
        } else if (!scene.isFinal) {
            // 無觸發條件且非最終場景，直接顯示箭頭
            updateNextButton(true);
        } else {
            updateNextButton(false);
        }
    }
}

function checkNarrativeTrigger(levelId) {
    const scene = story[currentStoryIndex];
    
    // 支援單一觸發條件 (triggerLevel) 或多重觸發條件 (triggerLevels)
    const isTriggered = scene.triggerLevel === levelId || 
                       (scene.triggerLevels && scene.triggerLevels.includes(levelId));
    
    if (scene && isTriggered) {
        updateNextButton(true);
        showMessage('success', '駭客已被逼入絕境！點擊右下角箭頭繼續追擊！');
    }
}

// ==================== Sidebar Logic ====================
let isSidebarExpanded = false;
window.toggleSidebar = function() {
    isSidebarExpanded = !isSidebarExpanded;
    const sidebar = $('#mission-sidebar');
    const icon = $('#sidebar-icon');
    
    if (isSidebarExpanded) {
        sidebar.classList.remove('-translate-x-full');
        sidebar.classList.add('translate-x-0');
        icon.textContent = 'chevron_left';
    } else {
        sidebar.classList.add('-translate-x-full');
        sidebar.classList.remove('translate-x-0');
        icon.textContent = 'chevron_right';
    }
}

// ==================== Data & State ====================
const challenges = [
    { 
        id: 1, 
        title: '隱形計時器', 
        desc: 'Console 面板', 
        icon: 'terminal', 
        color: 'blue', 
        fragment: 'Dev',
        completed: false,
        hint: '開啟 Console，點擊眼睛圖示 (Create Live Expression)，輸入 "window.game.timer"',
        knowledge: `<h2 class="text-2xl font-bold text-blue-400 mb-4">Console: Live Expressions</h2>
                    <p class="text-gray-300 mb-4">Live Expressions 允許你即時監控 JavaScript 表達式的值，而不用重複在 Console 輸入。</p>
                    <ul class="list-disc list-inside text-gray-400 space-y-2">
                        <li>點擊 Console 左上角的眼睛圖示 👁️</li>
                        <li>輸入變數名稱或運算式</li>
                        <li>數值會隨著系統狀態自動更新</li>
                    </ul>`
    },
    { 
        id: 2, 
        title: '碎片搜尋', 
        desc: 'Application 面板', 
        icon: 'storage', 
        color: 'purple', 
        fragment: 'Tools', 
        completed: false, 
        hint: '密碼碎片藏在 Application 面板的 Cookies 和 Local Storage 中',
        knowledge: `<h2 class="text-2xl font-bold text-purple-400 mb-4">Application Panel</h2>
                    <p class="text-gray-300 mb-4">此面板用於檢視和管理網頁應用程式的儲存空間。</p>
                    <ul class="list-disc list-inside text-gray-400 space-y-2">
                        <li><strong>Cookies:</strong> HTTP 請求攜帶的小型數據</li>
                        <li><strong>Local Storage:</strong> 持久的本機儲存空間</li>
                        <li><strong>Session Storage:</strong> 僅在當前分頁有效的暫存</li>
                    </ul>`
    },
    { 
        id: 3, 
        title: '渲染壓力', 
        desc: 'Performance 面板', 
        icon: 'speed', 
        color: 'yellow', 
        fragment: '20', 
        completed: false,
        hint: '開啟 Performance 面板錄製，找出長條的紅色 task，尋找 window.stopLag() 函式',
        knowledge: `<h2 class="text-2xl font-bold text-yellow-400 mb-4">Performance Panel</h2>
                    <p class="text-gray-300 mb-4">用於分析網頁運行效能，找出卡頓原因。</p>
                    <ul class="list-disc list-inside text-gray-400 space-y-2">
                        <li><strong>Flame Chart (火焰圖):</strong> 顯示函式呼叫堆疊與時間</li>
                        <li><strong>Long Tasks:</strong> 執行超過 50ms 的任務，會包含紅色標記</li>
                        <li><strong>Layout Shift:</strong> 視覺元素的不預期指動</li>
                    </ul>`
    },
    { 
        id: 4, 
        title: '網路雜訊', 
        desc: 'Network 面板', 
        icon: 'wifi', 
        color: 'green', 
        fragment: '2026', 
        completed: false, 
        hint: '開啟 Network 面板，過濾掉頻繁的 404 請求，尋找 200 OK 的 config.json，查看 Response 中的 SECRET_CODE_FRAGMENT',
        knowledge: `<h2 class="text-2xl font-bold text-green-400 mb-4">Network Panel</h2>
                    <p class="text-gray-300 mb-4">監控所有網路請求與資源載入狀況。</p>
                    <ul class="list-disc list-inside text-gray-400 space-y-2">
                        <li><strong>Filter (過濾):</strong> 依類型 (XHR/JS/Img) 或關鍵字篩選請求</li>
                        <li><strong>Status Codes:</strong> 200 (成功), 404 (找不到), 500 (伺服器錯誤)</li>
                        <li><strong>Timing:</strong> 分析請求各階段耗時 (TTFB, Download)</li>
                    </ul>`
    },
    { 
        id: 5, 
        title: '邏輯劫持', 
        desc: 'Sources 面板', 
        icon: 'code', 
        color: 'red', 
        fragment: null, 
        completed: false, 
        hint: '這一步沒有密碼碎片，你的任務是讓 [緊急解除] 按鈕生效。開啟 Sources 面板，Debug submitPassword 函式。',
        knowledge: `<h2 class="text-2xl font-bold text-red-500 mb-4">Sources Panel & Debugging</h2>
                    <p class="text-gray-300 mb-4">擁有強大的程式碼除錯與修改能力。</p>
                    <ul class="list-disc list-inside text-gray-400 space-y-2">
                        <li><strong>Breakpoints:</strong> 暫停程式執行以檢查變數</li>
                        <li><strong>Local Overrides:</strong> 直接在 DevTools 修改程式碼並持久保存</li>
                        <li><strong>Step Over/Into:</strong> 逐行執行程式碼</li>
                    </ul>`
    }
];

// ==================== UI Rendering ====================
function renderChallenges() {
    const lists = $$('.challenge-list'); // Modified to return NodeList
    if (!lists.length) return;
    
    // Create HTML logic once
    const htmlContent = challenges.map(c => `
        <div class="challenge-item p-3 rounded border-l-2 font-mono text-xs text-gray-300 hover:bg-${c.color}-900/10 transition-all duration-300 flex justify-between items-center group ${c.completed ? `bg-green-900/20 border-green-500 opacity-80` : `bg-[#1f242d] border-${c.color}-500`}" data-id="${c.id}">
            <div class="flex-grow">
                <div class="flex items-center gap-2 mb-1 text-gray-500 text-[10px]">
                    <span class="material-icons text-[10px] ${c.completed ? 'text-green-500' : ''}">${c.icon}</span> 
                    LEVEL ${c.id}
                </div>
                <div class="font-bold text-${c.color}-300">${c.title}</div>
                <div class="text-[10px] opacity-70">${c.desc}</div>
                ${c.completed && c.fragment ? `<div class="mt-1 text-green-400 font-bold bg-black/30 inline-block px-1 rounded">碎片: ${c.fragment}</div>` : ''}
            </div>
            
            <div class="flex gap-1 opacity-100 group-hover:opacity-100 transition-opacity">
                 <button onclick="showHint(${c.id})" class="p-1.5 hover:bg-white/10 rounded text-yellow-500" title="提示">
                    <span class="material-icons text-sm">lightbulb</span>
                 </button>
                 <button onclick="openKnowledge(${c.id})" class="p-1.5 hover:bg-white/10 rounded text-blue-400" title="知識點">
                    <span class="material-icons text-sm">menu_book</span>
                 </button>
                 <div class="w-6 flex items-center justify-center">
                    ${c.completed ? '<span class="material-icons text-green-500 text-sm animate-bounce">check_circle</span>' : ''}
                 </div>
            </div>
        </div>
    `).join('');

    // Apply to ALL lists (Mobile and Desktop)
    lists.forEach(list => {
        list.innerHTML = htmlContent;
    });
}

function markChallengeComplete(id) {
    const challenge = challenges.find(c => c.id === id);
    if (challenge && !challenge.completed) {
        challenge.completed = true;
        renderChallenges();
        checkNarrativeTrigger(id);
        
        if (challenge.fragment) {
             showMessage('success', `取得密碼碎片: [ ${challenge.fragment} ]`);
        }
    }
}

// ==================== Modal Logic ====================
window.openKnowledge = function(id) {
    const challenge = challenges.find(c => c.id === id);
    if (!challenge) return;
    
    const modal = $('#knowledge-modal');
    const content = $('#modal-content');
    content.innerHTML = challenge.knowledge;
    modal.classList.remove('hidden', 'pointer-events-none');
    setTimeout(() => modal.classList.remove('opacity-0'), 10);
    modal.querySelector('div').classList.remove('scale-95');
    modal.querySelector('div').classList.add('scale-100');
}

window.closeModal = function() {
    const modal = $('#knowledge-modal');
    modal.classList.add('opacity-0');
    modal.querySelector('div').classList.add('scale-95');
    modal.querySelector('div').classList.remove('scale-100');
    setTimeout(() => modal.classList.add('hidden', 'pointer-events-none'), 300);
}

window.showHint = function(id) {
    const challenge = challenges.find(c => c.id === id);
    if (challenge) showMessage('info', `提示: ${challenge.hint}`);
}

// ==================== Level Logic ====================

// 先初始化 window.game 物件
window.game = { timeLeft: 900, _internalTimer: 900 };

// --- Manual Fragment Verification (Level 2 & 4) ---
window.game.foundFragment = function(levelId, password) {
    const challenge = challenges.find(c => c.id === levelId);
    
    if (!challenge) {
        console.log('%c❌ 錯誤: 無效的關卡 ID', 'color: #ef4444; font-size: 14px; font-weight: bold;');
        return;
    }
    
    if (challenge.completed) {
        console.log(`%c✅ 關卡 ${levelId} 已經完成了！`, 'color: #10b981; font-size: 14px;');
        return;
    }
    
    // 驗證密碼
    if (password !== challenge.fragment) {
        console.log('%c❌ 密碼錯誤！', 'color: #ef4444; font-size: 16px; font-weight: bold;');
        console.log(`%c提示: 仔細檢查 ${challenge.desc} 中的資料...`, 'color: #f59e0b; font-size: 14px;');
        return;
    }
    
    // 密碼正確
    console.log('%c🎉 答對了！', 'color: #10b981; font-size: 18px; font-weight: bold;');
    console.log(`%c碎片已記錄: ${password}`, 'color: #3b82f6; font-size: 14px; background: #1f2937; padding: 4px 8px; border-radius: 4px;');
    markChallengeComplete(levelId);
}

// --- Level 1: Console ---
let observation = { count: 0, lastTime: 0, isConfirmed: false };
Object.defineProperty(window.game, 'timer', {
    get: function() {
        const now = Date.now();
        if (now - observation.lastTime < 500) observation.count++;
        else observation.count = 1;
        observation.lastTime = now;

        if (observation.count >= 5 && !observation.isConfirmed) {
            observation.isConfirmed = true;
            console.log('%c 🎉 偵測成功！取得碎片: Dev', 'color: #00ff00; font-size: 16px;');
            markChallengeComplete(1);
        }
        return this._internalTimer;
    }
});
setInterval(() => { if (window.game._internalTimer > 0) window.game._internalTimer--; }, 1000);

// --- Level 3: Performance ---
const perfIndicator = $('#performance-indicator');
window.startLag = function() {
    if (perfIndicator) perfIndicator.style.opacity = '1';
    window.lagInterval = setInterval(() => {
        const start = Date.now();
        while (Date.now() - start < 100) { Math.sqrt(Math.random()); } 
        if (perfIndicator) {
             perfIndicator.style.transform = `translate(-50%, -50%) rotate(${Date.now() % 360}deg) scale(${1 + Math.random() * 0.1})`;
        }
    }, 200);
}
window.stopLag = function() {
    clearInterval(window.lagInterval);
    if (perfIndicator) {
        perfIndicator.style.opacity = '0.3';
        perfIndicator.style.animation = 'none';
        perfIndicator.style.borderColor = '#4caf50';
    }
    console.log('✅ 效能優化完成！取得碎片: 20'); 
    markChallengeComplete(3);
}
setTimeout(window.startLag, 3000);

// --- Level 2 (App) & 4 (Network) ---
function initStorage() {
    document.cookie = `Fragment_1=Dev; path=/`; 
    localStorage.setItem('Fragment_2', 'Tools'); 
}
setInterval(() => {
    const signalId = Math.random().toString(36).substring(7);
    fetch(`https://www.google/signal.json`).catch(()=>{});
}, 4000);
setTimeout(() => {
    fetch('/config.json').then(r => r.json()).then(data => {});
}, 10000);


// --- Level 5 & Submission ---
window.submitPassword = function() {
    const input = $('#password-input');
    const val = input.value.trim();
    const correctPass = "DevTools2026";
    
    if (val !== correctPass) {
         showMessage('error', '密碼錯誤！請檢查各關卡收集到的碎片 (Dev...Tools...20...26)');
         input.classList.add('animate-shake');
         setTimeout(() => input.classList.remove('animate-shake'), 500);
         return;
    }

    const isSystemIntegrityCheckPassed = false; 
    
    if (isSystemIntegrityCheckPassed) {
        markChallengeComplete(5);
        showMessage('success', '🎉 系統解鎖成功！炸彈已拆除！');
        $('#timer').classList.add('text-green-500');
        $('#timer').textContent = "DEFUSED";
        input.disabled = true;
        input.classList.add('text-green-500', 'border-green-500');
        $('#defuse-btn').classList.add('bg-green-500', 'hover:bg-green-600');
        currentStoryIndex = 4;
        advanceNarrative();
    } else {
        if (currentStoryIndex === 3) advanceNarrative(); 
        showMessage('error', '❌ 錯誤：系統邏輯較驗失敗！(Level 5: 檢查 Sources 面板 submitPassword 函式)');
    }
}

// ==================== Keyboard Shortcuts ====================
// 右方向鍵觸發駭客對話下一步
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight') {
        const mobileArrow = $('#mobile-next-btn');
        const desktopArrow = $('#desktop-next-btn');
        
        // 檢查任一箭頭按鈕可見
        const isMobileVisible = mobileArrow && !mobileArrow.classList.contains('hidden');
        const isDesktopVisible = desktopArrow && !desktopArrow.classList.contains('hidden');
        
        if (isMobileVisible || isDesktopVisible) {
            e.preventDefault(); // 防止頁面滾動
            advanceNarrative();
        }
    }
});

// Init
window.addEventListener('DOMContentLoaded', () => {
    renderChallenges();
    initStorage();
    updateVillainMessage(story[0].text);
    updateNextButton(true);
    
    $('#password-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') window.submitPassword();
    });
});
