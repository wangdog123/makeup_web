document.addEventListener('scroll', () => {
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        // 獲取滾動距離
        const scrollPosition = window.scrollY;
        
        // 減少移動速度並限制範圍（圖片移動速度是滾動速度的 0.2 倍，往上移動）
        const moveDistance = Math.max(scrollPosition * -0.3, -100); // 最多往上移動 100px
        
        heroImage.style.transform = `translateY(${moveDistance}px)`;
    }
});
