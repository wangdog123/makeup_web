// 妝容細節切換功能
function showStyleDetail(style) {
    // 移除所有按鈕的active class
    var buttons = document.getElementsByClassName('style-detail-btn');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
    }
    
    // 隱藏所有細節內容區塊
    var contents = document.getElementsByClassName('style-detail-content');
    for (var i = 0; i < contents.length; i++) {
        contents[i].style.display = 'none';
        contents[i].classList.remove('active');
    }
    
    // 隱藏所有影片內容
    var videos = document.getElementsByClassName('video-content');
    for (var i = 0; i < videos.length; i++) {
        videos[i].style.display = 'none';
        videos[i].classList.remove('active');
    }
    
    // 顯示選中的細節內容
    var selectedContent = document.getElementById(style + '-detail');
    selectedContent.style.display = 'block';
    selectedContent.classList.add('active');
    
    // 顯示選中的影片內容
    var selectedVideo = document.getElementById(style + '-video');
    if (selectedVideo) {
        selectedVideo.style.display = 'flex';
        selectedVideo.classList.add('active');
    }
    
    // 為所有對應風格的按鈕添加active class
    var buttons = document.getElementsByClassName('style-detail-btn');
    for (var i = 0; i < buttons.length; i++) {
        // 檢查按鈕的onclick屬性中是否包含當前選中的style
        var onclickAttr = buttons[i].getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes("'" + style + "'")) {
            buttons[i].classList.add('active');
        }
    }
}

// 化妝步驟切換功能
function showStep(stepNumber) {
    // 取得所有相關按鈕（上方按鈕列 + 側邊導航列）
    var topButtons = document.querySelectorAll('.step-type-buttons .skin-type-btn');
    var sideButtons = document.querySelectorAll('[data-section="color-makeup"] .skin-type-btn');
    var allButtons = [];
    
    // 合併按鈕陣列
    for(var i=0; i<topButtons.length; i++) allButtons.push(topButtons[i]);
    for(var i=0; i<sideButtons.length; i++) allButtons.push(sideButtons[i]);

    // 移除所有按鈕的active class
    for (var i = 0; i < allButtons.length; i++) {
        allButtons[i].classList.remove('active');
    }
    
    // 隱藏所有步驟內容區塊
    var contents = document.querySelectorAll('[data-section="color-makeup"] .skin-content');
    for (var i = 0; i < contents.length; i++) {
        contents[i].style.display = 'none';
        contents[i].classList.remove('active');
    }
    
    // 顯示選中的步驟內容
    var selectedContent = document.getElementById('step-' + stepNumber);
    if (selectedContent) {
        selectedContent.style.display = 'block';
        selectedContent.classList.add('active');
    }
    
    // 為對應按鈕添加active class
    for (var i = 0; i < allButtons.length; i++) {
        var onclickAttr = allButtons[i].getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes('(' + stepNumber + ')')) {
            allButtons[i].classList.add('active');
        }
    }

    // 滾動到 .skin-type-section
    setTimeout(function() {
        var section = document.querySelector('.skin-type-content[data-section="color-makeup"]');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 100);
}

// 頁面載入時檢查URL hash,自動顯示對應的妝容細節
window.addEventListener('DOMContentLoaded', function() {
    // 取得URL中的hash值 (例如: #sweet, #bitter, #spicy, #salt)
    var hash = window.location.hash.substring(1); // 移除#符號
    
    // 如果有hash值且對應的細節區塊存在,就顯示該區塊
    if (hash && document.getElementById(hash + '-detail')) {
        showStyleDetail(hash);
        
        // 延遲滾動,確保內容已完全顯示
        setTimeout(function() {
            var detailElement = document.getElementById(hash + '-detail');
            if (detailElement) {
                // 取得元素距離頂部的位置,加上偏移量讓它顯示在更下面
                var elementPosition = detailElement.getBoundingClientRect().top + window.pageYOffset;
                var offsetPosition = elementPosition + 65; // 加上200px,讓它往下滾動更多
                
                // 平滑滾動到目標位置
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }
});

// 膚質類型切換功能
function showSkinType(type) {
    // 移除所有按鈕的active class
    var allButtons = document.querySelectorAll('.skin-type-btn');
    for (var i = 0; i < allButtons.length; i++) {
        allButtons[i].classList.remove('active');
    }
    
    // 隱藏所有膚質內容
    var contents = document.getElementsByClassName('skin-content');
    for (var i = 0; i < contents.length; i++) {
        contents[i].style.display = 'none';
        contents[i].classList.remove('active');
    }
    
    // 顯示選中的膚質內容
    var selectedContent = document.getElementById(type + '-content');
    if (selectedContent) {
        selectedContent.style.display = 'block';
        selectedContent.classList.add('active');
    }
    
    // 為所有對應按鈕添加active class（頂部和側邊）
    allButtons = document.querySelectorAll('.skin-type-btn');
    for (var i = 0; i < allButtons.length; i++) {
        var onclickAttr = allButtons[i].getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes("'" + type + "'")) {
            allButtons[i].classList.add('active');
        }
    }
    setTimeout(function() {
        var skinTypeContent = document.querySelector('.skin-type-content');
        if (skinTypeContent) {
            var headerOffset = 0;
            var elementPosition = skinTypeContent.getBoundingClientRect().top + window.pageYOffset;
            var offsetPosition = elementPosition - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }, 100);
}

// 下拉選單切換功能
function toggleSection(value) {
    var skinTypeButtons = document.querySelector('.skin-type-buttons');
    var stepTypeButtons = document.querySelector('.step-type-buttons');
    var allContents = document.querySelectorAll('.skin-type-content');
    
    // 隱藏所有區塊和按鈕
    if (skinTypeButtons) skinTypeButtons.style.display = 'none';
    if (stepTypeButtons) stepTypeButtons.style.display = 'none';
    for (var i = 0; i < allContents.length; i++) {
        allContents[i].style.display = 'none';
    }
    
    // 根據選擇顯示對應區塊
    if (value === 'skin-test') {
        // 顯示膚質測試
        if (skinTypeButtons) skinTypeButtons.style.display = 'flex';
        var skinTestContent = document.querySelector('.skin-type-content:not([data-section])');
        if (skinTestContent) skinTestContent.style.display = 'flex';
        
        // 滾動到 .skin-type-section
        setTimeout(function() {
            var section = document.querySelector('.skin-type-section');
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    } else if (value === 'base-makeup') {
        // 顯示底妝上妝
        var baseMakeup = document.querySelector('[data-section="base-makeup"]');
        if (baseMakeup) baseMakeup.style.display = 'flex';
        
        // 滾動到 content
        setTimeout(function() {
            if (baseMakeup) {
                baseMakeup.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    } else if (value === 'color-makeup') {
        // 顯示彩妝上妝
        if (stepTypeButtons) stepTypeButtons.style.display = 'flex';
        var colorMakeup = document.querySelector('[data-section="color-makeup"]');
        if (colorMakeup) colorMakeup.style.display = 'flex';
        
        // 滾動到 .skin-type-section
        setTimeout(function() {
            var section = document.querySelector('.skin-type-section');
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    }
}
