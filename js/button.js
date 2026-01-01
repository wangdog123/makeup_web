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
    
    // 顯示選中的細節內容
    var selectedContent = document.getElementById(style + '-detail');
    selectedContent.style.display = 'block';
    selectedContent.classList.add('active');
    
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
    // 移除所有按鈕的active class
    var buttons = document.getElementsByClassName('step-btn');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
    }
    
    // 隱藏所有步驟內容區塊
    var contents = document.getElementsByClassName('step-content');
    for (var i = 0; i < contents.length; i++) {
        contents[i].style.display = 'none';
        contents[i].classList.remove('active');
    }
    
    // 顯示選中的步驟內容
    var selectedContent = document.getElementById('step-' + stepNumber);
    selectedContent.style.display = 'block';
    selectedContent.classList.add('active');
    
    // 為所有對應步驟的按鈕添加active class
    var buttons = document.getElementsByClassName('step-btn');
    for (var i = 0; i < buttons.length; i++) {
        // 檢查按鈕的onclick屬性中是否包含當前選中的步驟編號
        var onclickAttr = buttons[i].getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes('(' + stepNumber + ')')) {
            buttons[i].classList.add('active');
        }
    }
    var targetSection = document.querySelector('.step-content.active');

    if (targetSection) {
        // 2. 設定 Header 的高度偏移量 (避免標題被 Header 擋住)
        var headerOffset = 110; 

        // 3. 計算該區塊距離頁面頂端的絕對位置
        var elementPosition = targetSection.getBoundingClientRect().top + window.pageYOffset;
        var offsetPosition = elementPosition;

        // 4. 平滑滾動過去
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
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
