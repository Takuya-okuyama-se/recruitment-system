// ハンバーガーメニューの動作を制御（最終版 - 確実に3本線を表示）
(function() {
    console.log('🍔 Hamburger menu script loading (final version)...');
    
    function forceCreateHamburgerLines(hamburger) {
        // 既存の子要素をすべて削除
        hamburger.innerHTML = '';
        
        // 3本線を強制的に作成
        for (let i = 0; i < 3; i++) {
            const line = document.createElement('div');
            line.className = 'hamburger-line';
            
            // 最強のインラインスタイル
            line.style.cssText = `
                display: block !important;
                width: 28px !important;
                height: 4px !important;
                background: linear-gradient(90deg, #000 0%, #333 100%) !important;
                border-radius: 2px !important;
                margin: 0 !important;
                padding: 0 !important;
                border: none !important;
                outline: none !important;
                opacity: 1 !important;
                visibility: visible !important;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                transform-origin: center !important;
                position: relative !important;
                z-index: 1 !important;
                box-sizing: border-box !important;
            `;
            
            // データ属性を追加
            line.setAttribute('data-line', i + 1);
            line.setAttribute('data-hamburger-line', 'true');
            
            hamburger.appendChild(line);
            
            // 要素が追加されたことを確認
            console.log(`🍔 Line ${i + 1} created:`, {
                element: line,
                styles: line.style.cssText,
                computed: window.getComputedStyle(line)
            });
        }
        
        // 作成後の検証
        setTimeout(() => {
            const lines = hamburger.querySelectorAll('.hamburger-line');
            console.log(`🍔 Verification: ${lines.length} lines created`);
            lines.forEach((line, index) => {
                const computed = window.getComputedStyle(line);
                console.log(`🍔 Line ${index + 1} final styles:`, {
                    display: computed.display,
                    width: computed.width,
                    height: computed.height,
                    backgroundColor: computed.backgroundColor,
                    visibility: computed.visibility,
                    opacity: computed.opacity
                });
            });
        }, 100);
    }
    
    function createHamburgerMenu() {
        console.log('🍔 Creating hamburger menu...');
        
        // 既存のモバイルヘッダーを削除
        document.querySelectorAll('.mobile-header').forEach(el => el.remove());
        
        const navElements = document.querySelectorAll('nav');
        
        navElements.forEach((nav, index) => {
            console.log(`🍔 Processing nav element ${index}`);
            
            const navDiv = nav.querySelector('div');
            if (!navDiv) {
                console.warn(`🍔 No div found in nav ${index}`);
                return;
            }
            
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
            hamburger.type = 'button';
            hamburger.setAttribute('aria-label', 'メニューを開く');
            hamburger.setAttribute('aria-expanded', 'false');
            
            // ハンバーガーのスタイル
            hamburger.style.cssText = `
                display: none !important;
                flex-direction: column !important;
                justify-content: center !important;
                align-items: center !important;
                gap: 4px !important;
                background: rgba(255, 255, 255, 0.95) !important;
                border: 2px solid #333 !important;
                border-radius: 6px !important;
                cursor: pointer !important;
                padding: 8px !important;
                position: absolute !important;
                right: 15px !important;
                top: 50% !important;
                transform: translateY(-50%) !important;
                z-index: 1001 !important;
                width: 45px !important;
                height: 45px !important;
                box-shadow: 0 3px 6px rgba(0,0,0,0.2) !important;
                box-sizing: border-box !important;
            `;
            
            // 要素を組み立て
            mobileHeader.appendChild(logo);
            mobileHeader.appendChild(hamburger);
            navDiv.insertBefore(mobileHeader, navLinks);
            
            // 3本線を強制作成
            forceCreateHamburgerLines(hamburger);
            
            // クリックイベント
            hamburger.addEventListener('click', function(e) {
                e.stopPropagation();
                console.log('🍔 Hamburger clicked');
                
                const isActive = hamburger.classList.toggle('active');
                navLinks.classList.toggle('active');
                hamburger.setAttribute('aria-expanded', isActive);
                
                // アニメーション
                const lines = hamburger.querySelectorAll('.hamburger-line');
                console.log(`🍔 Animating ${lines.length} lines, active: ${isActive}`);
                
                if (isActive) {
                    if (lines[0]) {
                        lines[0].style.transform = 'rotate(45deg) translate(8px, 8px)';
                        lines[0].style.transformOrigin = 'center';
                    }
                    if (lines[1]) {
                        lines[1].style.opacity = '0';
                        lines[1].style.transform = 'scale(0)';
                    }
                    if (lines[2]) {
                        lines[2].style.transform = 'rotate(-45deg) translate(8px, -8px)';
                        lines[2].style.transformOrigin = 'center';
                    }
                } else {
                    lines.forEach(line => {
                        line.style.transform = '';
                        line.style.opacity = '1';
                        line.style.transformOrigin = 'center';
                    });
                }
            });
            
            // 外部クリックで閉じる
            document.addEventListener('click', function(event) {
                if (!nav.contains(event.target)) {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                    
                    const lines = hamburger.querySelectorAll('.hamburger-line');
                    lines.forEach(line => {
                        line.style.transform = '';
                        line.style.opacity = '1';
                    });
                }
            });
            
            // リサイズ対応
            function handleResize() {
                const isMobile = window.innerWidth <= 768;
                console.log(`🍔 Resize event: mobile=${isMobile}, width=${window.innerWidth}`);
                
                if (isMobile) {
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
                    hamburger.setAttribute('aria-expanded', 'false');
                }
                
                // モバイルでハンバーガーラインを再確認
                if (isMobile) {
                    const lines = hamburger.querySelectorAll('.hamburger-line');
                    if (lines.length !== 3) {
                        console.warn('🍔 Lines missing on mobile, recreating...');
                        forceCreateHamburgerLines(hamburger);
                    }
                }
            }
            
            window.addEventListener('resize', handleResize);
            handleResize(); // 初期実行
            
            console.log(`🍔 Hamburger menu created for nav ${index}`);
        });
    }
    
    // 複数のタイミングで実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createHamburgerMenu);
    } else {
        createHamburgerMenu();
    }
    
    window.addEventListener('load', () => {
        setTimeout(createHamburgerMenu, 200);
    });
    
    // 定期的なチェック（デバッグ用）
    let checkCount = 0;
    const checkInterval = setInterval(() => {
        checkCount++;
        if (checkCount > 10) {
            clearInterval(checkInterval);
            return;
        }
        
        const hamburgers = document.querySelectorAll('.hamburger');
        hamburgers.forEach((hamburger, index) => {
            const lines = hamburger.querySelectorAll('.hamburger-line');
            if (lines.length < 3 && window.innerWidth <= 768) {
                console.warn(`🍔 Check ${checkCount}: Hamburger ${index} missing lines (${lines.length}/3), recreating...`);
                forceCreateHamburgerLines(hamburger);
            }
        });
    }, 1000);
    
    console.log('🍔 Hamburger menu script loaded successfully');
})();