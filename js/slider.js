document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.style-cards-container');
    if (!slider) return;

    let isDown = false;
    let lastX; // 改用 lastX 記錄上一次的 X 座標
    let currentScrollPos = 0; 
    let speed = 0.5;
    let periodWidth = 0;
    let lastTimestamp = 0; // 用於計算幀間時間差
    const pixelsPerSecond = 60; // 每秒移動的像素數（可調整速度）
    
    // 取得原始項目
    const items = Array.from(slider.children);
    const itemCount = items.length;

    // 強制設定 scroll-behavior: auto，避免瀏覽器平滑滾動導致無縫跳轉失效 (看起來像倒退)
    slider.style.scrollBehavior = 'auto';

    // 1. 初始化與結構建構：[HeadClones] [Original] [TailClones]
    // 這樣可以確保左右都有緩衝區，解決 "回拉卡住" 與 "邊界抽動" 的問題
    if (itemCount > 0) {
        // 建立頭尾複製品
        const headClones = items.map(item => item.cloneNode(true));
        const tailClones = items.map(item => item.cloneNode(true));

        // 插入 Head Clones
        // 倒序插入 insertBefore(node, firstChild) -> 結果為正序 [1,2,3]
        for (let i = itemCount - 1; i >= 0; i--) {
            slider.insertBefore(headClones[i], slider.children[0]);
        }
        
        // 插入 Tail Clones
        tailClones.forEach(clone => slider.appendChild(clone));
        
        // DOM 結構現在是: [HeadClone Set] [Original Set] [TailClone Set]

        // 確保初始計算
        calculateDimensions();
        
        // 初始位置設定在中間的 Original Set 開頭
        if (periodWidth > 0) {
            slider.scrollLeft = periodWidth;
            currentScrollPos = periodWidth;
        }
    }

    function calculateDimensions() {
        if (slider.children.length < 3 * itemCount) return;
        
        // 計算一組內容的寬度 (含 gap)
        // 透過測量 Original Set 第一個元素與 Head Clone Set 第一個元素的距離(offsetLeft差值)
        // Head Clone Set 佔據索引 0 ~ itemCount-1
        // Original Set 佔據索引 itemCount
        const firstClone = slider.children[0];
        const firstOriginal = slider.children[itemCount];
        
        if (firstClone && firstOriginal) {
            // 這就是精確的週期寬度 (包含 margin/gap)
            periodWidth = firstOriginal.offsetLeft - firstClone.offsetLeft;
        }

        // 更新速度
        speed = Math.max(0.2, window.innerWidth / 2400);
    }

    window.addEventListener('resize', calculateDimensions);

    // 2. 自動滾動（基於時間的平滑滾動）
    function autoScroll(timestamp) {
        // 初始化時間戳
        if (!lastTimestamp) lastTimestamp = timestamp;
        
        if (!isDown && periodWidth > 0) {
            // 計算自上一幀以來經過的時間（毫秒）
            const deltaTime = timestamp - lastTimestamp;
            
            // 根據時間計算移動距離，確保在不同幀率下速度一致
            // 這樣即使幀率波動，滾動速度也會保持恆定
            const distance = (pixelsPerSecond / 1000) * deltaTime;
            currentScrollPos += distance;

            // 純數值邊界檢查
            if (currentScrollPos >= periodWidth * 2) {
                currentScrollPos -= periodWidth;
            } else if (currentScrollPos <= 0) {
                currentScrollPos += periodWidth;
            }

            slider.scrollLeft = currentScrollPos;
        }
        
        // 更新時間戳供下一幀使用
        lastTimestamp = timestamp;
        requestAnimationFrame(autoScroll);
    }

    // 3. 無縫循環檢查 (僅在拖曳時與 Resize 時使用)
    function checkInfiniteLoop() {
        if (periodWidth <= 0) return;
        
        // 向右捲動超過 Original Set 結尾 (進入 Tail Clone)
        if (slider.scrollLeft >= periodWidth * 2) {
            const offset = slider.scrollLeft - (periodWidth * 2);
            slider.scrollLeft = periodWidth + offset;
            currentScrollPos = slider.scrollLeft;
        }
        // 向左捲動超過 Original Set 開頭 (進入 Head Clone)
        else if (slider.scrollLeft <= 0) { 
            const offset = 0 - slider.scrollLeft;
            slider.scrollLeft = periodWidth - offset;
            currentScrollPos = slider.scrollLeft;
        }
    }

    // --- 新增：監聽 Scroll 事件 ---
    // 用於捕捉非拖曳的原生滾動（如滑鼠滾輪、觸控板），解決 "往回跑" 的衝突
    slider.addEventListener('scroll', () => {
        if (isDown) return; // 拖曳中由 mousemove/touchmove 控制，忽略此事件

        // 檢查誤差：只有當 DOM 的 scrollLeft 與內部的 currentScrollPos 差異較大時才同步
        // 這樣可以保留 sub-pixel 的平滑度，同時捕捉使用者的手動滾動
        if (Math.abs(slider.scrollLeft - currentScrollPos) > 3) {
            currentScrollPos = slider.scrollLeft;
        }
    });

    // --- Mouse Events (改為增量計算 Delta) ---
    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('active');
        lastX = e.pageX; // 記錄起始點
        e.preventDefault();
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('active');
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('active');
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        
        const currentX = e.pageX;
        const walk = (currentX - lastX) * 2; // 控制拖曳速度 (2倍速)
        
        // 純數值計算，避免讀取 DOM
        currentScrollPos -= walk;
        
        // 邊界檢查 (數值計算)
        if (currentScrollPos >= periodWidth * 2) {
            currentScrollPos -= periodWidth;
        } else if (currentScrollPos <= 0) {
            currentScrollPos += periodWidth;
        }
        
        // 一次性寫入 DOM
        slider.scrollLeft = currentScrollPos;
        
        // 更新 lastX 為當前位置，供下一次計算增量
        lastX = currentX;
    });

    // --- Touch Events (改為增量計算 Delta) ---
    slider.addEventListener('touchstart', (e) => {
        isDown = true;
        slider.classList.add('active');
        lastX = e.touches[0].pageX;
    });

    slider.addEventListener('touchend', () => {
        isDown = false;
        slider.classList.remove('active');
    });

    slider.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        
        const currentX = e.touches[0].pageX;
        const walk = (currentX - lastX) * 2; 
        
        // 純數值計算，避免讀取 DOM
        currentScrollPos -= walk;
        
        // 邊界檢查 (數值計算)
        if (currentScrollPos >= periodWidth * 2) {
            currentScrollPos -= periodWidth;
        } else if (currentScrollPos <= 0) {
            currentScrollPos += periodWidth;
        }
        
        // 一次性寫入 DOM
        slider.scrollLeft = currentScrollPos;
        
        lastX = currentX;
    });

    // 啟動自動滾動
    requestAnimationFrame(autoScroll);
});