// 一次性腳本：將預設留言遷移到 Firebase
// 使用方法：在 index.html 中暫時引入此腳本，刷新頁面後移除

async function migrateDefaultComments() {
    // 等待 Firebase 初始化
    if (typeof db === 'undefined') {
        console.error('Firebase 未初始化');
        return;
    }

    const defaultComments = [
        {
            username: 'chiwawa',
            message: '最近粉底真的使用CANMAKE的產品!',
            timestamp: '12月 25日 16:30',
            floor: 1,
            likes: 0,
            dislikes: 0,
            likedBy: [],
            dislikedBy: [],
            parentFloor: null,
            replyToSubFloor: null,
            createdAt: new Date('2024-12-25T16:30:00')
        },
        {
            username: 'chiwawa',
            message: '我覺得沒有想像的好用耶...',
            timestamp: '12月 25日 17:30',
            floor: 2,
            likes: 0,
            dislikes: 0,
            likedBy: [],
            dislikedBy: [],
            parentFloor: null,
            replyToSubFloor: null,
            createdAt: new Date('2024-12-25T17:30:00')
        },
        {
            username: 'chiwawa',
            message: '想要貓系眼妝,有沒有簡單的試驗TT',
            timestamp: '12月 25日 18:00',
            floor: 3,
            likes: 0,
            dislikes: 0,
            likedBy: [],
            dislikedBy: [],
            parentFloor: null,
            replyToSubFloor: null,
            createdAt: new Date('2024-12-25T18:00:00')
        },
        {
            username: 'chiwawa',
            message: '哇哇哇',
            timestamp: '12月 25日 18:30',
            floor: 4,
            likes: 0,
            dislikes: 0,
            likedBy: [],
            dislikedBy: [],
            parentFloor: null,
            replyToSubFloor: null,
            createdAt: new Date('2024-12-25T18:30:00')
        }
    ];

    try {
        console.log('開始遷移預設留言...');
        
        for (const comment of defaultComments) {
            await db.collection('comments').add(comment);
            console.log(`已新增 B${comment.floor}: ${comment.message}`);
        }
        
        console.log('✅ 遷移完成！請移除此腳本並刷新頁面。');
        alert('預設留言已成功加入資料庫！\n請從 HTML 中移除 migrate-comments.js 並刷新頁面。');
    } catch (error) {
        console.error('遷移失敗:', error);
        alert('遷移失敗，請查看 Console 了解詳情');
    }
}

// 頁面載入後自動執行
window.addEventListener('load', () => {
    setTimeout(migrateDefaultComments, 1000); // 等待 Firebase 初始化
});
