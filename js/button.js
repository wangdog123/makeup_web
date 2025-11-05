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
    selectedContent.style.display = 'flex';
    selectedContent.classList.add('active');
    
    // 添加對應按鈕的active class
    event.target.classList.add('active');
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
    
    // 添加對應按鈕的active class
    event.target.classList.add('active');
}
