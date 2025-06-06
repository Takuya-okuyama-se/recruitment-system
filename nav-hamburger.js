// ハンバーガーメニューの動作を制御
document.addEventListener('DOMContentLoaded', function() {
    // すべてのページのナビゲーションを更新
    const navElements = document.querySelectorAll('nav');
    
    navElements.forEach(nav => {
        // 既存のdiv要素を取得
        const navDiv = nav.querySelector('div');
        if (!navDiv) return;
        
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
        
        // ナビゲーションリンクをラップ
        const existingLinks = navDiv.innerHTML;
        navDiv.innerHTML = '';
        navDiv.appendChild(mobileHeader);
        navDiv.appendChild(hamburger);
        
        // nav-linksクラスのdivを作成
        const navLinks = document.createElement('div');
        navLinks.className = 'nav-links';
        navLinks.innerHTML = existingLinks;
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