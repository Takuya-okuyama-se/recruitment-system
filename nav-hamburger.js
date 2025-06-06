// ハンバーガーメニューの動作を制御
document.addEventListener('DOMContentLoaded', function() {
    // すべてのページのナビゲーションを更新
    const navElements = document.querySelectorAll('nav');
    
    navElements.forEach(nav => {
        // 既存のdiv要素を取得
        const navDiv = nav.querySelector('div');
        if (!navDiv) return;
        
        // インラインスタイルを削除
        navDiv.removeAttribute('style');
        navDiv.style.maxWidth = '1400px';
        navDiv.style.margin = '0 auto';
        
        // モバイルヘッダーを作成
        const mobileHeader = document.createElement('div');
        mobileHeader.className = 'mobile-header';
        
        // ロゴ/タイトルを追加
        const logo = document.createElement('div');
        logo.className = 'mobile-logo';
        logo.textContent = '採用管理システム';
        mobileHeader.appendChild(logo);
        
        // ハンバーガーボタンを作成
        const hamburger = document.createElement('button');
        hamburger.className = 'hamburger';
        hamburger.setAttribute('aria-label', 'メニュー');
        hamburger.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        
        // ナビゲーションリンクを取得
        const links = navDiv.querySelectorAll('.nav-link');
        
        // 既存の内容をクリア
        navDiv.innerHTML = '';
        
        // モバイルヘッダーとハンバーガーを追加
        navDiv.appendChild(mobileHeader);
        navDiv.appendChild(hamburger);
        
        // nav-linksクラスのdivを作成
        const navLinks = document.createElement('div');
        navLinks.className = 'nav-links';
        
        // リンクをnav-linksに追加
        links.forEach(link => {
            navLinks.appendChild(link.cloneNode(true));
        });
        
        navDiv.appendChild(navLinks);
        
        // ハンバーガーメニューのクリックイベント
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // メニュー外クリックで閉じる
        document.addEventListener('click', function(event) {
            if (!nav.contains(event.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
        
        // リンククリックでメニューを閉じる
        const links = navLinks.querySelectorAll('.nav-link');
        links.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    });
});