// ハンバーガーメニューの動作を制御（可視性改善版）
(function() {
    let setupAttempts = 0;
    const maxAttempts = 10;
    
    function setupNavigation() {
        setupAttempts++;
        console.log(`Navigation setup attempt ${setupAttempts}`);
        
        try {
            const navElements = document.querySelectorAll('nav');
            
            if (navElements.length === 0) {
                console.warn('No nav elements found');
                if (setupAttempts < maxAttempts) {
                    setTimeout(setupNavigation, 200);
                }
                return;
            }
            
            console.log('Navigation setup: Found', navElements.length, 'nav elements');
            
            navElements.forEach((nav, navIndex) => {
                if (nav.querySelector('.mobile-header')) {
                    console.log('Nav', navIndex, 'already processed');
                    return;
                }
                
                const navDiv = nav.querySelector('div');
                if (!navDiv) {
                    console.warn('No div found in nav element', navIndex);
                    return;
                }
                
                const links = Array.from(navDiv.querySelectorAll('.nav-link'));
                console.log('Found', links.length, 'nav links in nav', navIndex);
                
                if (links.length === 0) {
                    console.warn('No nav links found in nav', navIndex);
                    if (setupAttempts < maxAttempts) {
                        setTimeout(setupNavigation, 200);
                    }
                    return;
                }
                
                // navの位置を確実に相対位置にする
                nav.style.position = 'relative';
                
                // インラインスタイルを削除
                navDiv.removeAttribute('style');
                navDiv.style.maxWidth = '1400px';
                navDiv.style.margin = '0 auto';
                navDiv.style.position = 'relative';
                
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
                // より確実なスタイル適用（モバイルのみ）
                if (window.innerWidth <= 768) {
                    hamburger.style.cssText = `
                        display: flex !important;
                        flex-direction: column !important;
                        justify-content: center !important;
                        align-items: center !important;
                        gap: 4px !important;
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
                }
                hamburger.innerHTML = `
                    <span style="display: block !important; width: 24px !important; height: 3px !important; background-color: #000 !important; margin: 0 !important; border-radius: 2px !important;"></span>
                    <span style="display: block !important; width: 24px !important; height: 3px !important; background-color: #000 !important; margin: 0 !important; border-radius: 2px !important;"></span>
                    <span style="display: block !important; width: 24px !important; height: 3px !important; background-color: #000 !important; margin: 0 !important; border-radius: 2px !important;"></span>
                `;
                
                // デバッグ：ハンバーガーボタンのスタイルを確認
                setTimeout(() => {
                    const computedStyle = window.getComputedStyle(hamburger);
                    console.log('Hamburger visibility check:', {
                        display: computedStyle.display,
                        visibility: computedStyle.visibility,
                        opacity: computedStyle.opacity,
                        width: computedStyle.width,
                        height: computedStyle.height,
                        background: computedStyle.background,
                        position: computedStyle.position,
                        windowWidth: window.innerWidth
                    });
                }, 100);
                
                // 既存の内容をクリア
                navDiv.innerHTML = '';
                
                // モバイルヘッダーとハンバーガーを追加
                mobileHeader.appendChild(hamburger);
                navDiv.appendChild(mobileHeader);
                
                // nav-linksクラスのdivを作成
                const navLinks = document.createElement('div');
                navLinks.className = 'nav-links';
                
                // リンクをnav-linksに追加
                links.forEach(link => {
                    navLinks.appendChild(link.cloneNode(true));
                });
                
                navDiv.appendChild(navLinks);
                console.log('Navigation structure updated for nav', navIndex);
                
                // ハンバーガーメニューのクリックイベント
                hamburger.addEventListener('click', function(e) {
                    e.stopPropagation();
                    console.log('Hamburger clicked');
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
                const navMenuLinks = navLinks.querySelectorAll('.nav-link');
                navMenuLinks.forEach(link => {
                    link.addEventListener('click', function() {
                        if (window.innerWidth <= 768) {
                            hamburger.classList.remove('active');
                            navLinks.classList.remove('active');
                        }
                    });
                });
                
                // ウィンドウリサイズ時の処理
                window.addEventListener('resize', function() {
                    if (window.innerWidth <= 768) {
                        hamburger.style.display = 'flex !important';
                        mobileHeader.style.display = 'flex !important';
                        navLinks.style.display = hamburger.classList.contains('active') ? 'flex' : 'none';
                    } else {
                        hamburger.style.display = 'none !important';
                        mobileHeader.style.display = 'none !important';
                        navLinks.style.display = 'flex !important';
                        navLinks.style.position = 'static';
                        navLinks.style.flexDirection = 'row';
                    }
                });
            });
            
            console.log('Navigation setup completed successfully');
        } catch (error) {
            console.error('Error in navigation setup:', error);
            if (setupAttempts < maxAttempts) {
                setTimeout(setupNavigation, 200);
            }
        }
    }
    
    // 複数の方法で実行を保証
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupNavigation);
    } else {
        setupNavigation();
    }
    
    // window.onloadでも実行
    window.addEventListener('load', function() {
        setTimeout(setupNavigation, 100);
    });
})();