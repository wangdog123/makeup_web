// 定義每個風格的圖片數量與前綴設定
const styleConfig = {
    sweet: { count: 3, prefix: 'sweet' },
    salt: { count: 2, prefix: 'salt' },
    bitter: { count: 3, prefix: 'bitter' },
    spicy: { count: 3, prefix: 'spicy' }
};

// 定義風格卡片選擇器
const cardSelectors = {
    sweet: 'a[href="recommendations.html#sweet"]',
    salt: 'a[href="recommendations.html#salt"]',
    bitter: 'a[href="recommendations.html#bitter"]',
    spicy: 'a[href="recommendations.html#spicy"]'
};

// 記錄目前每個風格顯示到第幾張圖片
const currentIndices = {};

/**
 * 更新指定風格的所有卡片圖片 (包含輪播複製出來的卡片)
 * @param {string} style 風格名稱 (key of styleConfig)
 * @param {boolean} withTransition 是否使用轉場動畫 (淡入淡出)
 */
function updateImagesForStyle(style, withTransition = false) {
    const config = styleConfig[style];
    if (!config) return;

    // 如果尚未初始化索引，則隨機產生一個起始值 (1 ~ count)
    if (currentIndices[style] === undefined) {
        currentIndices[style] = Math.floor(Math.random() * config.count) + 1;
    }

    const index = currentIndices[style];
    const imagePath = `images/index/${config.prefix}${index}.png`;

    // 找出頁面上「所有」屬於該風格的卡片 (包含 slider.js 複製產生的 Clones)
    const selector = cardSelectors[style];
    const cards = document.querySelectorAll(selector);

    if (withTransition) {
        // 使用「絕對定位覆蓋法」實現無縫 Cross-Fade
        // 這樣可以保留原始圖片的 object-fit 特性，避免 CSS 背景圖造成的擠壓變形
        
        // 1. 預載新圖片
        const newImgObj = new Image();
        newImgObj.src = imagePath;
        newImgObj.onload = () => {
            cards.forEach(card => {
                const img = card.querySelector('.style-card-image');
                if (img) {
                    // A. 建立一個複製品 (Ghost Image) 覆蓋在原圖上方
                    // 這個複製品顯示的是「舊圖片」
                    const ghostImg = img.cloneNode(true);
                    
                    // 設定 Ghost Image 樣式，使其絕對定位於原圖上方
                    ghostImg.style.position = 'absolute';
                    ghostImg.style.top = '0';
                    ghostImg.style.left = '0';
                    ghostImg.style.width = '100%';
                    ghostImg.style.height = '100%';
                    ghostImg.style.zIndex = '2'; // 蓋在原圖上面
                    ghostImg.style.transition = 'opacity 0.8s ease'; // 設定淡出動畫
                    ghostImg.style.opacity = '1';
                    
                    // 插入 Ghost Image 到卡片中 (在原圖之後，或者作為 sibling)
                    // 因為 card 有 position: relative，所以 absolute 會相對於 card 定位
                    card.appendChild(ghostImg);

                    // B. 立即將底下的原圖換成「新圖片」
                    // 使用者目前看到的還是上面的 Ghost (舊圖)
                    img.src = imagePath;
                    
                    // C. 觸發 Ghost Image 淡出 (Opacity 1 -> 0)
                    // 使用 requestAnimationFrame 確保 DOM 更新後才執行 transition
                    requestAnimationFrame(() => {
                        ghostImg.style.opacity = '0';
                    });

                    // D. 動畫結束後移除 Ghost Image
                    setTimeout(() => {
                        if (ghostImg.parentElement) {
                            ghostImg.remove();
                        }
                    }, 800); // 對應 transition 時間
                }
            });
        };
    } else {
        // 直接換圖 (初始化時)
        cards.forEach(card => {
            const img = card.querySelector('.style-card-image');
            if (img) {
                img.src = imagePath;
                img.alt = `${style}妝容`;
            }
        });
    }
}

/**
 * 切換到下一張圖片
 */
function nextImage(style) {
    const config = styleConfig[style];
    if (!config) return;

    // 索引 +1，超過總數則回到 1
    let idx = currentIndices[style];
    idx++;
    if (idx > config.count) {
        idx = 1;
    }
    currentIndices[style] = idx;

    updateImagesForStyle(style, true);
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. 初始載入：為每個風格隨機選圖並套用 (無轉場)
    Object.keys(styleConfig).forEach(style => {
        updateImagesForStyle(style, false);
    });

    // 2. 自動輪播圖片：設定每 5 秒切換一次圖片 (稍微放慢一點，避免太頻繁)
    setInterval(() => {
        Object.keys(styleConfig).forEach(style => {
            // 只有當該風格有多張圖片時才切換
            if (styleConfig[style].count > 1) {
                // 為了避免所有圖片同時切換，加一點隨機延遲
                const randomDelay = Math.random() * 2000; 
                setTimeout(() => {
                    nextImage(style);
                }, randomDelay);
            }
        });
    }, 5000); 
});
