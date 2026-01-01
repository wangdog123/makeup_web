document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.style-cards-container');
    let isDown = false;
    let startX;
    let scrollLeft;
    let animationId; // 用來控制動畫的 ID
    
    // 設定自動滾動速度 (數字越大越快)
    const speed = 0.5; 

    // 1. 初始化內容：複製一份內容並接到後面
    if (slider) {
        const items = Array.from(slider.children);
        items.forEach(item => {
            const clone = item.cloneNode(true);
            slider.appendChild(clone);
        });
    }

    // 2. 自動滾動與無縫循環的核心函式
    function autoScroll() {
        // 如果使用者正在拖曳，就暫停自動滾動
        if (!isDown) {
            slider.scrollLeft += speed;
        }

        checkInfiniteLoop();
        
        // 持續執行下一幀動畫
        animationId = requestAnimationFrame(autoScroll);
    }

    // 3. 檢查並執行無縫跳轉
    function checkInfiniteLoop() {
        // scrollWidth 的一半就是原本內容的總寬度 (因為我們複製了一份)
        const maxScroll = slider.scrollWidth / 2;

        // 狀況 A: 往右捲到底了 -> 瞬間跳回開頭
        if (slider.scrollLeft >= maxScroll) {
            slider.scrollLeft -= maxScroll;
        }
        // 狀況 B: 往左捲到頭了 (使用者往回拖曳時) -> 瞬間跳到中後段
        else if (slider.scrollLeft <= 0) {
            slider.scrollLeft += maxScroll;
        }
    }

    // --- 以下是原本的拖曳事件監聽 (微調過) ---

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('active');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        // 這裡不需要取消動畫，因為 autoScroll 裡面有判斷 if (!isDown)
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
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2; // 控制拖曳速度
        slider.scrollLeft = scrollLeft - walk;
        
        // 拖曳時也要即時檢查是否需要無縫跳轉
        checkInfiniteLoop();
    });

    // 啟動自動滾動
    autoScroll();
});