// 膚質切換功能
function showSkinType(type) {
    // 移除所有按鈕的active class
    var buttons = document.getElementsByClassName('skin-type-btn');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
    }
    
    // 隱藏所有內容區塊
    var contents = document.getElementsByClassName('skin-type-content');
    for (var i = 0; i < contents.length; i++) {
        contents[i].style.display = 'none';
        contents[i].classList.remove('active');
    }
    
    // 顯示選中的內容
    var selectedContent = document.getElementById(type);
    selectedContent.style.display = 'block';
    selectedContent.classList.add('active');
    
    // 添加對應按鈕的active class
    event.target.classList.add('active');
}
