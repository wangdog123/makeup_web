// ========================================
// 漢堡選單功能 - Hamburger Menu
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const mainNav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-link');

    // 切換選單開關
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', () => {
            hamburgerMenu.classList.toggle('active');
            mainNav.classList.toggle('active');
        });
    }

    // 點擊導航連結後關閉選單
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                hamburgerMenu.classList.remove('active');
                mainNav.classList.remove('active');
            }
        });
    });

    // 點擊選單外部區域關閉選單
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024) {
            if (!mainNav.contains(e.target) && !hamburgerMenu.contains(e.target)) {
                hamburgerMenu.classList.remove('active');
                mainNav.classList.remove('active');
            }
        }
    });
});
