document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburgerMenu');
    const nav = document.getElementById('mainNav');
    const header = document.querySelector('header');
    
    let lastScrollTop = 0;
    let isScrolling = false;
    const scrollThreshold = 150; // 往上滑的閾值

    // 滾動時顯示/隱藏 header
    window.addEventListener('scroll', () => {
        // 只在 1024px 以下時啟用
        if (window.innerWidth > 1024) return;
        
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        // 在頁面頂部時總是顯示 header
        if (currentScroll <= 0) {
            header.classList.add('show');
            lastScrollTop = currentScroll;
            return;
        }
        
        // 往上滑：需要超過閾值才顯示
        if (currentScroll < lastScrollTop) {
            const scrollDifference = lastScrollTop - currentScroll;
            if (scrollDifference >= scrollThreshold) {
                header.classList.add('show');
                lastScrollTop = currentScroll;
            }
        } 
        // 往下滑：立即隱藏（但選單打開時不隱藏）
        else if (currentScroll > lastScrollTop && !nav.classList.contains('open')) {
            header.classList.remove('show');
            lastScrollTop = currentScroll;
        }
    });

    // 漢堡選單點擊
    hamburger.addEventListener('click', () => {
        // 切換導覽列的顯示狀態
        nav.classList.toggle('open');
        
        // (選用) 這裡可以加入漢堡按鈕變成 X 的動畫 class
        hamburger.classList.toggle('active');
        
        // 打開選單時確保 header 顯示
        if (nav.classList.contains('open')) {
            header.classList.add('show');
        }
    });

    // (選用) 點擊連結後自動關閉選單
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
            hamburger.classList.remove('active');
        });
    });
    
    // 初始化：在頁面載入時檢查是否在頂部
    if (window.innerWidth <= 1024) {
        if (window.pageYOffset === 0) {
            header.classList.add('show');
        }
    }
});