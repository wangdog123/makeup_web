// ========================================
// 留言板功能 - Forum Functions
// ========================================

class ForumManager {
    constructor() {
        this.forumList = document.getElementById('forumList');
        this.forumInput = document.getElementById('forumInput');
        this.commentCount = 0;
        this.init();
    }

    init() {
        // 計算現有留言數量
        this.commentCount = document.querySelectorAll('.forum-item').length;

        // 綁定展開/收合按鈕
        this.bindToggleButton();

        // 監聽輸入框的Enter鍵
        if (this.forumInput) {
            this.forumInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && this.forumInput.value.trim()) {
                    this.addComment(this.forumInput.value.trim());
                    this.forumInput.value = '';
                }
            });
        }

        // 綁定按讚按鈕事件
        this.bindLikeButtons();
        
        // 綁定倒讚按鈕事件
        this.bindDislikeButtons();
        
        // 綁定回覆按鈕事件
        this.bindReplyButtons();
        
        // 綁定回覆連結的點擊事件
        this.bindReplyLinks();
        
        // 綁定查看回覆按鈕
        this.bindToggleRepliesButtons();
    }

    // 新增留言 (之後會連接到資料庫)
    async addComment(message) {
        const now = new Date();
        const dateStr = `${now.getMonth() + 1}月 ${now.getDate()}日 ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        // 解析回覆標記 (B1, B1-1, B2-3 等)
        const mainReplyMatch = message.match(/^B(\d+)-(\d+)\s+/); // B1-1 格式
        const floorReplyMatch = message.match(/^B(\d+)\s+/); // B1 格式
        let parentFloor = null;
        let replyToSubFloor = null;
        let actualMessage = message;
        
        if (mainReplyMatch) {
            // 回覆子樓層 (B1-1)
            parentFloor = parseInt(mainReplyMatch[1]);
            replyToSubFloor = `B${mainReplyMatch[1]}-${mainReplyMatch[2]}`;
            actualMessage = message.substring(mainReplyMatch[0].length);
        } else if (floorReplyMatch) {
            // 回覆主樓層 (B1)
            parentFloor = parseInt(floorReplyMatch[1]);
            actualMessage = message.substring(floorReplyMatch[0].length);
        }
        
        const commentData = {
            id: Date.now(),
            username: 'chiwawa',
            message: actualMessage,
            parentFloor: parentFloor,
            replyToSubFloor: replyToSubFloor,
            timestamp: dateStr,
            likes: 0,
            dislikes: 0
        };

        // TODO: 將資料發送到後端API
        // await fetch('/api/comments', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(commentData)
        // });

        // 暫時直接在前端顯示
        if (parentFloor) {
            this.renderReply(commentData, parentFloor);
        }
        else {
            this.commentCount++;
            commentData.floor = this.commentCount;
            this.renderComment(commentData);
        }
    }

    // 渲染留言到頁面
    renderComment(data) {
        const commentHTML = `
            <div class="forum-item" data-id="${data.id}" id="comment-${data.floor}">
                <div class="forum-avatar">
                    <img src="images/index/avatar.png" alt="使用者頭像" class="avatar-img">
                </div>
                <div class="forum-content">
                    <div class="forum-header">
                        <span class="forum-username">${data.username}</span>
                        <div class="forum-actions">
                            <button class="forum-like" data-liked="false">
                                <span class="like-icon">♡</span>
                                <span class="like-count">${data.likes}</span>
                            </button>
                            <button class="forum-dislike" data-disliked="false">
                                <span class="dislike-icon">🖓</span>
                            </button>
                        </div>
                    </div>
                    <div class="forum-text">
                        <p class="forum-message">${this.escapeHTML(data.message)}</p>
                    </div>
                    <div class="forum-meta">
                        <span class="forum-floor">B${data.floor},</span>
                        <span class="forum-time">${data.timestamp}</span>
                        <button class="forum-btn forum-reply">回覆</button>
                        <button class="forum-btn forum-share">分享</button>
                        <button class="forum-toggle-replies" data-count="0" style="display: none;">
                            <span class="reply-count-text">查看其他 0 則留言</span>
                        </button>
                    </div>
                </div>
            </div>
            <!-- 回覆列表 -->
            <div class="forum-replies-list" data-parent="${data.floor}" style="display: none;"></div>
        `;

        if (this.forumList) {
            // 插入到 toggle button 之前
            const toggleBtn = this.forumList.querySelector('.forum-toggle-btn');
            if (toggleBtn) {
                toggleBtn.insertAdjacentHTML('beforebegin', commentHTML);
            } else {
                this.forumList.insertAdjacentHTML('beforeend', commentHTML);
            }
            
            this.bindLikeButtons();
            this.bindDislikeButtons();
            this.bindReplyButtons();
            this.bindReplyLinks();
            this.bindToggleRepliesButtons();
        }
    }
    
    // 渲染回覆到對應樓層下方
    renderReply(data, parentFloor) {
        // 計算該樓層的回覆數量
        const repliesList = document.querySelector(`.forum-replies-list[data-parent="${parentFloor}"]`);
        const currentReplyCount = repliesList ? repliesList.querySelectorAll('.forum-reply-item').length : 0;
        const replyFloor = currentReplyCount + 1;
        const replyId = `comment-${parentFloor}-${replyFloor}`;
        
        // 判斷是回覆主樓層還是子樓層
        let replyToLink = '';
        if (data.replyToSubFloor) {
            // 回覆子樓層，需要找到對應的元素ID
            const targetFloor = data.replyToSubFloor; // 例如 "B1-1"
            const targetId = targetFloor.replace('B', 'comment-').replace('-', '-');
            replyToLink = `<a href="#${targetId}" class="reply-to">${data.replyToSubFloor}</a> `;
        } else {
            // 回覆主樓層
            replyToLink = `<a href="#comment-${parentFloor}" class="reply-to">B${parentFloor}</a> `;
        }
        
        const replyHTML = `
            <div class="forum-item forum-reply-item" data-id="${data.id}" id="${replyId}">
                <div class="forum-avatar">
                    <img src="images/index/avatar.png" alt="使用者頭像" class="avatar-img">
                </div>
                <div class="forum-content">
                    <div class="forum-header">
                        <span class="forum-username">${data.username}</span>
                        <div class="forum-actions">
                            <button class="forum-like" data-liked="false">
                                <span class="like-icon">♡</span>
                                <span class="like-count">${data.likes}</span>
                            </button>
                            <button class="forum-dislike" data-disliked="false">
                                <span class="dislike-icon">🖓</span>
                            </button>
                        </div>
                    </div>
                    <div class="forum-text">
                        <p class="forum-message">${replyToLink}${this.escapeHTML(data.message)}</p>
                    </div>
                    <div class="forum-meta">
                        <span class="forum-floor">B${parentFloor}-${replyFloor},</span>
                        <span class="forum-time">${data.timestamp}</span>
                        <button class="forum-btn forum-reply">回覆</button>
                        <button class="forum-btn forum-share">分享</button>
                    </div>
                </div>
            </div>
        `;
        
        // 找到對應的回覆列表
        const parentComment = document.getElementById(`comment-${parentFloor}`);
        
        if (repliesList && parentComment) {
            const toggleBtn = parentComment.querySelector('.forum-toggle-replies');
            
            // 插入回覆
            repliesList.insertAdjacentHTML('beforeend', replyHTML);
            
            // 更新回覆數量
            const currentCount = parseInt(toggleBtn.dataset.count);
            const newCount = currentCount + 1;
            toggleBtn.dataset.count = newCount;
            toggleBtn.querySelector('.reply-count-text').textContent = `查看其他 ${newCount} 則留言`;
            toggleBtn.style.display = 'inline-block';
            
            // 自動展開回覆列表
            repliesList.style.display = 'block';
            toggleBtn.classList.add('expanded');
            
            this.bindLikeButtons();
            this.bindDislikeButtons();
            this.bindReplyButtons();
            this.bindReplyLinks();
        }
    }

    // 綁定按讚按鈕
    bindLikeButtons() {
        const likeButtons = document.querySelectorAll('.forum-like');
        likeButtons.forEach(btn => {
            // 移除舊的事件監聽器
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.addEventListener('click', async (e) => {
                const button = e.currentTarget;
                const liked = button.dataset.liked === 'true';
                const countSpan = button.querySelector('.like-count');
                const iconSpan = button.querySelector('.like-icon');
                const commentId = button.closest('.forum-item').dataset.id;
                
                // 如果有倒讚，先取消倒讚
                const dislikeBtn = button.closest('.forum-actions').querySelector('.forum-dislike');
                if (dislikeBtn && dislikeBtn.dataset.disliked === 'true') {
                    dislikeBtn.dataset.disliked = 'false';
                    dislikeBtn.querySelector('.dislike-icon').textContent = '🖓';
                }
                
                let count = parseInt(countSpan.textContent);
                
                if (liked) {
                    count--;
                    button.dataset.liked = 'false';
                    iconSpan.textContent = '♡';
                } else {
                    count++;
                    button.dataset.liked = 'true';
                    iconSpan.textContent = '♥';
                }
                
                countSpan.textContent = count;

                // TODO: 更新資料庫
                // await fetch(`/api/comments/${commentId}/like`, {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify({ liked: !liked })
                // });
            });
        });
    }

    // 綁定倒讚按鈕
    bindDislikeButtons() {
        const dislikeButtons = document.querySelectorAll('.forum-dislike');
        dislikeButtons.forEach(btn => {
            // 移除舊的事件監聽器
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.addEventListener('click', async (e) => {
                const button = e.currentTarget;
                const disliked = button.dataset.disliked === 'true';
                const iconSpan = button.querySelector('.dislike-icon');
                const commentId = button.closest('.forum-item').dataset.id;
                
                // 如果有按讚，先取消按讚
                const likeBtn = button.closest('.forum-actions').querySelector('.forum-like');
                if (likeBtn && likeBtn.dataset.liked === 'true') {
                    const countSpan = likeBtn.querySelector('.like-count');
                    let count = parseInt(countSpan.textContent);
                    count--;
                    countSpan.textContent = count;
                    likeBtn.dataset.liked = 'false';
                    likeBtn.querySelector('.like-icon').textContent = '♡';
                }
                
                if (disliked) {
                    button.dataset.disliked = 'false';
                    iconSpan.textContent = '🖓';
                } else {
                    button.dataset.disliked = 'true';
                    iconSpan.textContent = '👎︎';
                }

                // TODO: 更新資料庫
                // await fetch(`/api/comments/${commentId}/dislike`, {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify({ disliked: !disliked })
                // });
            });
        });
    }

    // 綁定回覆按鈕
    bindReplyButtons() {
        const replyButtons = document.querySelectorAll('.forum-reply');
        replyButtons.forEach(btn => {
            // 移除舊的事件監聽器
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.addEventListener('click', (e) => {
                const forumItem = newBtn.closest('.forum-item');
                const floorSpan = forumItem.querySelector('.forum-floor');
                
                if (floorSpan) {
                    const floor = floorSpan.textContent.replace(',', '').trim();
                    
                    // 在輸入框中添加回覆標記
                    if (this.forumInput) {
                        this.forumInput.value = `${floor} `;
                        this.forumInput.focus();
                    }
                }
            });
        });
    }

    // 綁定回覆連結的點擊事件
    bindReplyLinks() {
        const replyLinks = document.querySelectorAll('.reply-to');
        replyLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    // 高亮效果
                    targetElement.style.backgroundColor = '#FFE4E9';
                    setTimeout(() => {
                        targetElement.style.backgroundColor = '';
                    }, 1000);
                }
            });
        });
    }

    // 綁定展開/收合按鈕
    bindToggleButton() {
        const toggleBtn = document.getElementById('forumToggleBtn');
        const forumList = document.getElementById('forumList');
        const forumSection = document.querySelector('.forum-section');
        
        if (toggleBtn && forumList && forumSection) {
            toggleBtn.addEventListener('click', () => {
                forumList.classList.toggle('expanded');
                forumSection.classList.toggle('expanded');
            });
        }
    }
    
    // 綁定查看回覆按鈕
    bindToggleRepliesButtons() {
        const toggleBtns = document.querySelectorAll('.forum-toggle-replies');
        toggleBtns.forEach(btn => {
            // 移除舊的事件監聽器
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.addEventListener('click', () => {
                const forumItem = newBtn.closest('.forum-item');
                const floor = forumItem.id.replace('comment-', '');
                const repliesList = document.querySelector(`.forum-replies-list[data-parent="${floor}"]`);
                
                if (repliesList) {
                    if (repliesList.style.display === 'none') {
                        repliesList.style.display = 'block';
                        newBtn.classList.add('expanded');
                    } else {
                        repliesList.style.display = 'none';
                        newBtn.classList.remove('expanded');
                    }
                }
            });
        });
    }

    // 防止XSS攻擊 - HTML轉義
    escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // 從資料庫載入留言 (之後實作)
    async loadComments() {
        try {
            // TODO: 從後端API獲取留言資料
            // const response = await fetch('/api/comments');
            // const comments = await response.json();
            // comments.forEach(comment => this.renderComment(comment));
            
            console.log('資料庫連接功能待實作');
        } catch (error) {
            console.error('載入留言失敗:', error);
        }
    }
}

// 當DOM載入完成後初始化留言板
document.addEventListener('DOMContentLoaded', () => {
    const forumManager = new ForumManager();
    // forumManager.loadComments(); // 之後啟用資料庫載入
});
