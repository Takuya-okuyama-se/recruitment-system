// 認証とセッション管理システム
(function() {
    'use strict';
    
    // 設定
    const CONFIG = {
        // 本番環境パスワード
        ADMIN_PASSWORD: "Recruit2024@Admin#",
        // デモ環境パスワード
        DEMO_PASSWORD: "demo2024",
        // セッション時間（ミリ秒）
        ADMIN_SESSION_DURATION: 2 * 60 * 60 * 1000, // 2時間
        DEMO_SESSION_DURATION: 30 * 60 * 1000,      // 30分
        // ストレージキー
        SESSION_KEY: 'recruitment_session',
        MODE_KEY: 'recruitment_mode',
        // デモモード識別
        DEMO_PARAM: 'demo'
    };
    
    // 現在のモードを判定
    function getCurrentMode() {
        const urlParams = new URLSearchParams(window.location.search);
        const savedMode = localStorage.getItem(CONFIG.MODE_KEY);
        
        if (urlParams.has(CONFIG.DEMO_PARAM)) {
            return 'demo';
        }
        
        return savedMode || 'admin';
    }
    
    // セッション情報を保存
    function saveSession(mode) {
        const sessionData = {
            mode: mode,
            loginTime: Date.now(),
            duration: mode === 'demo' ? CONFIG.DEMO_SESSION_DURATION : CONFIG.ADMIN_SESSION_DURATION,
            lastActivity: Date.now()
        };
        
        localStorage.setItem(CONFIG.SESSION_KEY, JSON.stringify(sessionData));
        localStorage.setItem(CONFIG.MODE_KEY, mode);
        
        console.log(`🔐 Session saved: ${mode} mode`);
    }
    
    // セッション情報を取得
    function getSession() {
        try {
            const sessionStr = localStorage.getItem(CONFIG.SESSION_KEY);
            return sessionStr ? JSON.parse(sessionStr) : null;
        } catch (e) {
            console.error('Session parse error:', e);
            return null;
        }
    }
    
    // セッションの有効性をチェック
    function isSessionValid() {
        const session = getSession();
        if (!session) return false;
        
        const now = Date.now();
        const elapsed = now - session.loginTime;
        const inactiveTime = now - session.lastActivity;
        
        // セッション時間切れ
        if (elapsed > session.duration) {
            console.log('🔐 Session expired (time limit)');
            return false;
        }
        
        // 30分間非アクティブでタイムアウト
        if (inactiveTime > 30 * 60 * 1000) {
            console.log('🔐 Session expired (inactive)');
            return false;
        }
        
        return true;
    }
    
    // セッションの最終アクティビティを更新
    function updateActivity() {
        const session = getSession();
        if (session) {
            session.lastActivity = Date.now();
            localStorage.setItem(CONFIG.SESSION_KEY, JSON.stringify(session));
        }
    }
    
    // ログアウト
    function logout() {
        localStorage.removeItem(CONFIG.SESSION_KEY);
        localStorage.removeItem(CONFIG.MODE_KEY);
        console.log('🔐 Logged out');
        
        // ログイン画面にリダイレクト
        showLoginScreen();
    }
    
    // デモモードか判定
    function isDemoMode() {
        const session = getSession();
        return session && session.mode === 'demo';
    }
    
    // ログイン画面を表示
    function showLoginScreen() {
        // 既にログイン画面が表示されている場合はスキップ
        if (document.getElementById('loginScreen')) {
            console.log('🔐 Login screen already displayed');
            return;
        }
        
        const currentMode = getCurrentMode();
        
        // ページ全体を隠す
        document.body.style.display = 'none';
        
        // ログイン画面HTML
        const loginHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                display: flex;
                justify-content: center;
                align-items: center;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                z-index: 10000;
            " id="loginScreen">
                <div style="
                    background: white;
                    padding: 40px;
                    border-radius: 15px;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                    max-width: 400px;
                    width: 90%;
                    text-align: center;
                ">
                    <div style="margin-bottom: 30px;">
                        <h1 style="color: #1f2937; margin-bottom: 10px; font-size: 28px;">🏢</h1>
                        <h2 style="color: #1f2937; margin-bottom: 10px;">採用管理システム</h2>
                        <p style="color: #6b7280; font-size: 14px;">
                            ${currentMode === 'demo' ? 'デモ環境' : '管理画面'}へのログイン
                        </p>
                    </div>
                    
                    <form id="loginForm" style="margin-bottom: 20px;">
                        <div style="margin-bottom: 20px;">
                            <input type="password" id="passwordInput" placeholder="パスワードを入力" style="
                                width: 100%;
                                padding: 12px 16px;
                                border: 2px solid #e5e7eb;
                                border-radius: 8px;
                                font-size: 16px;
                                outline: none;
                                transition: border-color 0.2s ease;
                                box-sizing: border-box;
                            " required>
                        </div>
                        
                        <button type="submit" style="
                            width: 100%;
                            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
                            color: white;
                            border: none;
                            padding: 12px 24px;
                            border-radius: 8px;
                            font-size: 16px;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.2s ease;
                        " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                            ログイン
                        </button>
                    </form>
                    
                    <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; font-size: 12px; color: #9ca3af;">
                        ${currentMode === 'demo' ? 
                            '🎯 デモモード: 閲覧専用・テストデータ<br>セッション: 30分' : 
                            '🔒 管理者モード: 全機能利用可能<br>セッション: 2時間'
                        }
                    </div>
                    
                    ${currentMode === 'demo' ? '' : `
                        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
                            <a href="?demo" style="color: #6366f1; text-decoration: none; font-size: 14px;">
                                📋 デモ版を見る
                            </a>
                        </div>
                    `}
                </div>
            </div>
        `;
        
        // ログイン画面を挿入
        document.body.insertAdjacentHTML('beforeend', loginHTML);
        
        // フォーカス設定
        setTimeout(() => {
            document.getElementById('passwordInput').focus();
        }, 100);
        
        // ログインフォーム処理
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const password = document.getElementById('passwordInput').value;
            const expectedPassword = currentMode === 'demo' ? CONFIG.DEMO_PASSWORD : CONFIG.ADMIN_PASSWORD;
            
            if (password === expectedPassword) {
                // ログイン成功
                saveSession(currentMode);
                document.getElementById('loginScreen').remove();
                document.body.style.display = '';
                
                // 成功メッセージ
                showNotification(`✅ ${currentMode === 'demo' ? 'デモ' : '管理者'}モードでログインしました`, 'success');
                
                // デモモードの場合は制限を適用
                if (currentMode === 'demo') {
                    enableDemoMode();
                }
                
            } else {
                // ログイン失敗
                showNotification('❌ パスワードが間違っています', 'error');
                document.getElementById('passwordInput').value = '';
                document.getElementById('passwordInput').focus();
            }
        });
    }
    
    // 通知表示
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 500;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 10001;
            transition: all 0.3s ease;
            max-width: 300px;
            font-size: 14px;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // アニメーション
        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
        }, 10);
        
        // 自動削除
        setTimeout(() => {
            notification.style.transform = 'translateY(-20px)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // デモモードを有効化
    function enableDemoMode() {
        console.log('🎯 Demo mode enabled');
        
        // 危険な操作を無効化
        const dangerousButtons = document.querySelectorAll('button[onclick*="delete"], button[onclick*="Delete"], .btn-danger, .btn-delete');
        dangerousButtons.forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.title = 'デモモードでは削除できません';
        });
        
        // フォーム送信を制限
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                showNotification('🎯 デモモードのためデータは保存されません', 'info');
            });
        });
        
        // デモバナーを表示
        showDemoBanner();
    }
    
    // デモバナーを表示
    function showDemoBanner() {
        const banner = document.createElement('div');
        banner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: white;
            text-align: center;
            padding: 8px 16px;
            font-weight: 600;
            font-size: 14px;
            z-index: 999;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;
        banner.innerHTML = '🎯 デモモード | テストデータのみ | 一部機能制限あり | セッション: 30分';
        
        document.body.insertAdjacentElement('afterbegin', banner);
        
        // ページコンテンツを下にずらす
        document.body.style.paddingTop = '40px';
    }
    
    // セッション監視とUI更新
    function setupSessionMonitoring() {
        // ログアウトボタンを追加
        const logoutButton = document.createElement('button');
        logoutButton.textContent = '🚪 ログアウト';
        logoutButton.style.cssText = `
            position: fixed;
            top: ${isDemoMode() ? '50px' : '10px'};
            right: 10px;
            background: rgba(0,0,0,0.7);
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            z-index: 1000;
            transition: all 0.2s ease;
        `;
        
        logoutButton.addEventListener('click', logout);
        logoutButton.addEventListener('mouseover', () => {
            logoutButton.style.background = 'rgba(0,0,0,0.9)';
        });
        logoutButton.addEventListener('mouseout', () => {
            logoutButton.style.background = 'rgba(0,0,0,0.7)';
        });
        
        document.body.appendChild(logoutButton);
        
        // アクティビティ監視
        ['click', 'keypress', 'scroll', 'mousemove'].forEach(event => {
            document.addEventListener(event, updateActivity, { passive: true });
        });
        
        // 定期的なセッションチェック
        setInterval(() => {
            if (!isSessionValid()) {
                logout();
            }
        }, 60000); // 1分毎
        
        // セッション残り時間表示
        setInterval(() => {
            const session = getSession();
            if (session) {
                const remaining = session.duration - (Date.now() - session.loginTime);
                if (remaining < 5 * 60 * 1000 && remaining > 0) { // 5分以内
                    const minutes = Math.floor(remaining / 60000);
                    showNotification(`⏰ セッション残り${minutes}分`, 'warning');
                }
            }
        }, 60000);
    }
    
    // 初期化
    function init() {
        // 既に初期化済みの場合はスキップ
        if (window.AuthSystemInitialized) {
            console.log('🔐 Auth system already initialized');
            return;
        }
        window.AuthSystemInitialized = true;
        
        console.log('🔐 Auth system initializing...');
        
        // セッション確認
        if (!isSessionValid()) {
            showLoginScreen();
            return;
        }
        
        // セッション監視開始
        setupSessionMonitoring();
        
        // デモモードの場合は制限を適用
        if (isDemoMode()) {
            enableDemoMode();
        }
        
        console.log(`🔐 Auth system ready (${isDemoMode() ? 'demo' : 'admin'} mode)`);
    }
    
    // グローバル関数としてエクスポート
    window.AuthSystem = {
        logout,
        isDemoMode,
        getCurrentMode,
        isSessionValid
    };
    
    // DOM読み込み完了後に初期化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();