// ハンバーガーメニューの動作を制御（確実に3本線を表示する版）
(function() {
    console.log('Hamburger menu script loading...');
    
    function createHamburgerMenu() {
        console.log('Creating hamburger menu...');
        
        // 既存のモバイルヘッダーを削除
        document.querySelectorAll('.mobile-header').forEach(el => el.remove());
        
        const navElements = document.querySelectorAll('nav');
        
        navElements.forEach((nav, index) => {
            console.log('Processing nav element', index);
            
            const navDiv = nav.querySelector('div');
            if (!navDiv) return;
            
            // navLinksを見つけるか作成
            let navLinks = navDiv.querySelector('.nav-links');
            if (!navLinks) {
                navLinks = document.createElement('div');
                navLinks.className = 'nav-links';
                
                // 既存のリンクを移動
                const existingLinks = navDiv.querySelectorAll('.nav-link');
                existingLinks.forEach(link => {
                    navLinks.appendChild(link.cloneNode(true));
                });
                
                navDiv.innerHTML = '';
                navDiv.appendChild(navLinks);
            }
            
            // モバイルヘッダーを作成
            const mobileHeader = document.createElement('div');
            mobileHeader.className = 'mobile-header';
            mobileHeader.style.cssText = `
                display: none;
                justify-content: space-between;
                align-items: center;
                padding: 10px 20px;
                min-height: 50px;
            `;
            
            // ロゴを作成
            const logo = document.createElement('div');
            logo.className = 'mobile-logo';
            logo.textContent = '採用管理システム';
            logo.style.cssText = `
                color: white;
                font-size: 18px;
                font-weight: bold;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            `;
            
            // ハンバーガーボタンを作成
            const hamburger = document.createElement('button');
            hamburger.className = 'hamburger';
            hamburger.style.cssText = `
                display: none;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 4px;
                background: rgba(255, 255, 255, 0.9) !important;
                border: 1px solid #ddd !important;
                border-radius: 4px !important;
                cursor: pointer !important;
                padding: 8px !important;
                position: absolute !important;
                right: 20px !important;
                top: 50% !important;
                transform: translateY(-50%) !important;
                z-index: 1001 !important;
                width: 40px !important;
                height: 40px !important;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
            `;
            
            // 3本線を作成
            for (let i = 0; i < 3; i++) {
                const line = document.createElement('div');
                line.style.cssText = `
                    width: 24px !important;
                    height: 3px !important;
                    background-color: #000 !important;
                    border-radius: 2px !important;
                    transition: all 0.3s ease !important;
                    display: block !important;
                    opacity: 1 !important;
                    visibility: visible !important;
                `;
                line.setAttribute('data-line', i);
                hamburger.appendChild(line);
            }
            
            // 要素を組み立て
            mobileHeader.appendChild(logo);
            mobileHeader.appendChild(hamburger);
            navDiv.insertBefore(mobileHeader, navLinks);
            
            // イベントリスナー
            hamburger.addEventListener('click', function(e) {
                e.stopPropagation();
                console.log('Hamburger clicked');
                
                const isActive = hamburger.classList.toggle('active');
                navLinks.classList.toggle('active');
                
                // アニメーション
                const lines = hamburger.querySelectorAll('div');
                if (isActive) {
                    if (lines[0]) lines[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                    if (lines[1]) lines[1].style.opacity = '0';
                    if (lines[2]) lines[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
                } else {
                    lines.forEach(line => {
                        line.style.transform = '';
                        line.style.opacity = '1';
                    });
                }
            });
            
            // 外部クリックで閉じる
            document.addEventListener('click', function(event) {
                if (!nav.contains(event.target)) {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                    const lines = hamburger.querySelectorAll('div');
                    lines.forEach(line => {
                        line.style.transform = '';
                        line.style.opacity = '1';
                    });
                }
            });
            
            // リサイズ対応
            function handleResize() {
                if (window.innerWidth <= 768) {
                    mobileHeader.style.display = 'flex';
                    hamburger.style.display = 'flex';
                    if (!hamburger.classList.contains('active')) {
                        navLinks.style.display = 'none';
                    }
                } else {
                    mobileHeader.style.display = 'none';
                    hamburger.style.display = 'none';
                    navLinks.style.display = 'flex';
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            }
            
            window.addEventListener('resize', handleResize);
            handleResize(); // 初期実行
            
            console.log('Hamburger menu created for nav', index);
        });
    }
    
    // 複数のタイミングで実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createHamburgerMenu);
    } else {
        createHamburgerMenu();
    }
    
    window.addEventListener('load', () => {
        setTimeout(createHamburgerMenu, 100);
    });
})();