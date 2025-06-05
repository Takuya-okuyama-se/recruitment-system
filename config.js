// API設定
// RenderのURLに変更する場合は、以下のAPI_BASE_URLを更新してください
// 例: https://recruitment-system-app.onrender.com
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : 'https://recruitment-system-app.onrender.com'; // ←実際のRenderのURLに変更してください

// 設定をグローバルに公開
window.API_CONFIG = {
    BASE_URL: API_BASE_URL
};