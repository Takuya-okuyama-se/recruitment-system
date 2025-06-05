// 統一ナビゲーションバー
const navigationHTML = `
<style>
    .main-navigation {
        background-color: #FF6B35;
        padding: 15px 0;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        margin-bottom: 20px;
        position: sticky;
        top: 0;
        z-index: 100;
    }
    .nav-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 20px;
    }
    .nav-title {
        color: white;
        font-size: 1.8em;
        font-weight: bold;
        text-align: center;
        margin-bottom: 15px;
    }
    .nav-links {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px;
    }
    .nav-link {
        background-color: rgba(255, 255, 255, 0.2);
        color: white;
        text-decoration: none;
        padding: 8px 16px;
        border-radius: 5px;
        transition: all 0.3s;
        font-size: 14px;
        display: inline-flex;
        align-items: center;
        gap: 5px;
    }
    .nav-link:hover {
        background-color: rgba(255, 255, 255, 0.3);
        transform: translateY(-2px);
    }
    .nav-link.active {
        background-color: white;
        color: #FF6B35;
        font-weight: bold;
    }
    .nav-section {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: center;
        padding: 5px 0;
    }
    .nav-divider {
        width: 100%;
        height: 1px;
        background-color: rgba(255, 255, 255, 0.3);
        margin: 10px 0;
    }
    @media (max-width: 768px) {
        .nav-links {
            flex-direction: column;
            align-items: stretch;
        }
        .nav-link {
            text-align: center;
            width: 100%;
        }
        .nav-section {
            flex-direction: column;
        }
    }
</style>

<nav class="main-navigation">
    <div class="nav-container">
        <h1 class="nav-title">🌟 採用管理システム採用管理システム</h1>
        <div class="nav-links">
            <div class="nav-section">
                <a href="dashboard.html" class="nav-link" id="nav-dashboard">
                    <span>📊</span> ダッシュボード
                </a>
                <a href="candidate-form.html" class="nav-link" id="nav-candidate">
                    <span>👥</span> 候補者管理
                </a>
                <a href="evaluation-form.html" class="nav-link" id="nav-evaluation">
                    <span>📝</span> 面接評価
                </a>
                <a href="aptitude-test-form.html" class="nav-link" id="nav-aptitude">
                    <span>📋</span> 適性検査
                </a>
                <a href="offer-management.html" class="nav-link" id="nav-offer">
                    <span>💼</span> 内定管理
                </a>
            </div>
            <div class="nav-divider"></div>
            <div class="nav-section">
                <a href="organization-settings.html" class="nav-link" id="nav-organization">
                    <span>🏢</span> 組織設定
                </a>
                <a href="data-management.html" class="nav-link" id="nav-data">
                    <span>📊</span> データ管理
                </a>
                <a href="db-viewer.html" class="nav-link" id="nav-db">
                    <span>🗄️</span> データベース
                </a>
                <a href="stage-detail.html" class="nav-link" id="nav-stage">
                    <span>🔍</span> ステージ詳細
                </a>
            </div>
        </div>
    </div>
</nav>
`;

// ナビゲーションを挿入
function insertNavigation() {
    const body = document.body;
    const firstChild = body.firstChild;
    const navDiv = document.createElement('div');
    navDiv.innerHTML = navigationHTML;
    body.insertBefore(navDiv.firstChild, firstChild);
    
    // 現在のページをハイライト
    const currentPage = window.location.pathname.split('/').pop();
    const pageMap = {
        'dashboard.html': 'nav-dashboard',
        'candidate-form.html': 'nav-candidate',
        'evaluation-form.html': 'nav-evaluation',
        'aptitude-test-form.html': 'nav-aptitude',
        'offer-management.html': 'nav-offer',
        'organization-settings.html': 'nav-organization',
        'data-management.html': 'nav-data',
        'db-viewer.html': 'nav-db',
        'stage-detail.html': 'nav-stage'
    };
    
    const activeNavId = pageMap[currentPage];
    if (activeNavId) {
        const activeLink = document.getElementById(activeNavId);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
}

// DOMが読み込まれたらナビゲーションを挿入
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', insertNavigation);
} else {
    insertNavigation();
}