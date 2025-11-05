// 定義每個風格的圖片數量
const styleImages = {
    sweet: 3,    // sweet1, sweet2, sweet3
    salt: 2,     // salt1, salt2
    bitter: 3,   // bitter1, bitter2, bitter3
    spicy: 3     // spicy1, spicy2, spicy3
};

// 定義風格卡片與檔名的對應關係
const cardStyles = [
    { selector: 'a[href="recommendations.html#sweet"]', style: 'sweet' },
    { selector: 'a[href="recommendations.html#salt"]', style: 'salt' },
    { selector: 'a[href="recommendations.html#bitter"]', style: 'bitter' },
    { selector: 'a[href="recommendations.html#spicy"]', style: 'spicy' }
];

document.addEventListener('DOMContentLoaded', () => {
    cardStyles.forEach(({ selector, style }) => {
        const cards = document.querySelectorAll(selector); // 改用 querySelectorAll 選擇所有符合的卡片
        cards.forEach(card => {
            const img = card.querySelector('.style-card-image');
            if (img) {
                // 隨機選擇該風格的一張圖片
                const maxImages = styleImages[style];
                const randomNum = Math.floor(Math.random() * maxImages) + 1;
                const imagePath = `images/index/${style}${randomNum}.png`;
                img.src = imagePath;
                img.alt = `${style}妝容`;
            }
        });
    });
});
