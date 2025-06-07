// デモデータ管理システム（修正版）
(function() {
    'use strict';
    
    // デモ用サンプルデータ
    const DEMO_DATA = {
        departments: [
            { id: 1, name: 'オーラルケア事業部' },
            { id: 2, name: 'ヘルス＆ビューティケア事業部' },
            { id: 3, name: 'リビングケア事業部' },
            { id: 10, name: '基盤研究開発部' },
            { id: 11, name: 'オーラルケア研究開発部' },
            { id: 30, name: '国内営業本部' },
            { id: 42, name: '人事総務部' }
        ],
        
        positions: [
            { 
                id: 1, 
                title: 'プロダクトマネージャー（オーラルケア）', 
                department_id: 1,
                departments: { name: 'オーラルケア事業部' },
                requirements: '・消費財マーケティング経験5年以上\n・オーラルケア製品の商品企画経験があれば尚可\n・英語力（TOEIC800点以上）'
            },
            { 
                id: 2, 
                title: 'ブランドマネージャー（GUM/Ora2）', 
                department_id: 1,
                departments: { name: 'オーラルケア事業部' },
                requirements: '・ブランドマネジメント経験3年以上\n・P&L管理経験\n・グローバルブランド経験があれば尚可'
            },
            { 
                id: 3, 
                title: '研究員（口腔科学）', 
                department_id: 11,
                departments: { name: 'オーラルケア研究開発部' },
                requirements: '・薬学、歯学、生物学等の修士以上\n・口腔細菌、歯周病研究の経験\n・英語論文読解能力'
            },
            { 
                id: 4, 
                title: 'デジタルマーケティングマネージャー', 
                department_id: 30,
                departments: { name: '国内営業本部' },
                requirements: '・デジタルマーケティング経験5年以上\n・EC、D2C事業の経験\n・Google Analytics、MA tools使用経験'
            },
            { 
                id: 5, 
                title: '総合職（新卒）', 
                department_id: 42,
                departments: { name: '人事総務部' },
                requirements: '・2025年3月卒業見込みの方\n・全国転勤可能な方\n・グローバルに活躍したい方'
            }
        ],
        
        candidates: [
            {
                id: 1,
                name: '山田太郎',
                email: 'yamada.taro@example.com',
                phone: '090-1234-5678',
                position_id: 1,
                source: 'エージェント',
                status: '一次面接',
                created_at: '2024-11-15T09:00:00.000Z',
                resume_url: 'https://example.com/resume1.pdf',
                notes: '大手消費財メーカーでの経験あり。英語力も高く有望な候補者。',
                positions: { title: 'プロダクトマネージャー（オーラルケア）' },
                recruitment_stages: [
                    { id: 1, stage: '書類選考', status: '合格', created_at: '2024-11-15T09:00:00.000Z' },
                    { id: 2, stage: '一次面接', status: '進行中', created_at: '2024-11-20T10:00:00.000Z' }
                ]
            },
            {
                id: 2,
                name: '佐藤花子',
                email: 'sato.hanako@example.com',
                phone: '080-2345-6789',
                position_id: 3,
                source: '自社採用サイト',
                status: '最終面接',
                created_at: '2024-11-10T14:30:00.000Z',
                resume_url: 'https://example.com/resume2.pdf',
                notes: '研究経験豊富。論文実績も多数あり。',
                positions: { title: '研究員（口腔科学）' },
                recruitment_stages: [
                    { id: 3, stage: '書類選考', status: '合格', created_at: '2024-11-10T14:30:00.000Z' },
                    { id: 4, stage: '一次面接', status: '合格', created_at: '2024-11-15T15:00:00.000Z' },
                    { id: 5, stage: '二次面接', status: '合格', created_at: '2024-11-22T16:00:00.000Z' },
                    { id: 6, stage: '最終面接', status: '進行中', created_at: '2024-11-25T11:00:00.000Z' }
                ]
            },
            {
                id: 3,
                name: '鈴木一郎',
                email: 'suzuki.ichiro@example.com',
                phone: '070-3456-7890',
                position_id: 4,
                source: 'リファラル',
                status: '内定',
                created_at: '2024-11-01T10:15:00.000Z',
                resume_url: 'https://example.com/resume3.pdf',
                notes: '社員紹介。デジタルマーケティング経験豊富で即戦力。',
                positions: { title: 'デジタルマーケティングマネージャー' },
                recruitment_stages: [
                    { id: 7, stage: '書類選考', status: '合格', created_at: '2024-11-01T10:15:00.000Z' },
                    { id: 8, stage: '一次面接', status: '合格', created_at: '2024-11-05T14:00:00.000Z' },
                    { id: 9, stage: '最終面接', status: '合格', created_at: '2024-11-12T15:30:00.000Z' },
                    { id: 10, stage: '内定', status: '進行中', created_at: '2024-11-18T16:00:00.000Z' }
                ]
            },
            {
                id: 4,
                name: '田中美咲',
                email: 'tanaka.misaki@example.com',
                phone: '080-4567-8901',
                position_id: 2,
                source: 'LinkedIn',
                status: '適性検査',
                created_at: '2024-11-18T11:20:00.000Z',
                resume_url: 'https://example.com/resume4.pdf',
                notes: 'ブランドマネジメント経験あり。コミュニケーション能力高い。',
                positions: { title: 'ブランドマネージャー（GUM/Ora2）' },
                recruitment_stages: [
                    { id: 11, stage: '書類選考', status: '合格', created_at: '2024-11-18T11:20:00.000Z' },
                    { id: 12, stage: '適性検査', status: '進行中', created_at: '2024-11-22T09:00:00.000Z' }
                ]
            },
            {
                id: 5,
                name: '高橋健太',
                email: 'takahashi.kenta@example.com',
                phone: '090-5678-9012',
                position_id: 5,
                source: '大学推薦',
                status: '二次面接',
                created_at: '2024-11-20T13:45:00.000Z',
                resume_url: 'https://example.com/resume5.pdf',
                notes: '新卒採用。優秀な成績で大学推薦。グローバル志向強い。',
                positions: { title: '総合職（新卒）' },
                recruitment_stages: [
                    { id: 13, stage: '書類選考', status: '合格', created_at: '2024-11-20T13:45:00.000Z' },
                    { id: 14, stage: '一次面接', status: '合格', created_at: '2024-11-25T10:30:00.000Z' },
                    { id: 15, stage: '二次面接', status: '進行中', created_at: '2024-11-28T14:00:00.000Z' }
                ]
            },
            {
                id: 6,
                name: '渡辺由美',
                email: 'watanabe.yumi@example.com',
                phone: '080-6789-0123',
                position_id: 1,
                source: 'エージェント',
                status: '書類選考',
                created_at: '2024-11-25T16:30:00.000Z',
                resume_url: 'https://example.com/resume6.pdf',
                notes: '外資系消費財での経験あり。海外勤務経験もある。',
                positions: { title: 'プロダクトマネージャー（オーラルケア）' },
                recruitment_stages: [
                    { id: 16, stage: '書類選考', status: '不合格', created_at: '2024-11-25T16:30:00.000Z' }
                ]
            }
        ],
        
        evaluations: [
            {
                id: 1,
                candidate_id: 1,
                stage_id: 2,
                technical_score: 4,
                communication_score: 5,
                cultural_fit_score: 4,
                overall_score: 4,
                recommendation: '推薦',
                strengths: 'マーケティング戦略立案能力が高い。論理的思考力がある。',
                weaknesses: '技術的な詳細について少し弱い面がある。',
                notes: '経験豊富で即戦力になりそう。次のステップに進めるべき。',
                created_at: '2024-11-20T15:30:00.000Z',
                users: { name: '面接官A' },
                recruitment_stages: { stage: '一次面接' }
            },
            {
                id: 2,
                candidate_id: 2,
                stage_id: 5,
                technical_score: 5,
                communication_score: 4,
                cultural_fit_score: 5,
                overall_score: 5,
                recommendation: '強く推薦',
                strengths: '研究能力が非常に高い。専門知識が豊富。チームワークも良い。',
                weaknesses: '特に目立った弱点はない。',
                notes: '優秀な候補者。ぜひ採用したい。',
                created_at: '2024-11-22T17:00:00.000Z',
                users: { name: '面接官B' },
                recruitment_stages: { stage: '二次面接' }
            }
        ],
        
        aptitude_tests: [
            {
                id: 1,
                candidate_id: 4,
                test_date: '2024-11-22',
                logical_thinking_score: 85,
                numerical_ability_score: 78,
                verbal_ability_score: 82,
                personality_traits: 'チームワーク重視、積極性高い、ストレス耐性良好',
                overall_result: '合格推奨',
                notes: 'バランスの取れた能力。特に論理的思考力が高い。',
                created_at: '2024-11-22T16:45:00.000Z'
            }
        ],
        
        offers: [
            {
                id: 1,
                candidate_id: 3,
                position_id: 4,
                salary: 7500000,
                start_date: '2025-01-15',
                response_deadline: '2024-12-15',
                status: '承諾',
                offer_details: '年俸750万円、賞与年2回、各種手当含む',
                notes: '条件交渉により最終決定。入社日調整済み。',
                created_at: '2024-11-18T18:00:00.000Z'
            }
        ]
    };
    
    // デモモードかチェック（改善版）
    function isDemoMode() {
        // URLパラメータを最優先
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('demo')) {
            console.log('🎯 Demo mode detected from URL parameter');
            return true;
        }
        
        // AuthSystemが利用可能な場合
        if (window.AuthSystem && typeof window.AuthSystem.isDemoMode === 'function') {
            const result = window.AuthSystem.isDemoMode();
            console.log('🎯 Demo mode from AuthSystem:', result);
            return result;
        }
        
        // セッション情報をチェック
        try {
            const session = localStorage.getItem('recruitment_session');
            if (session) {
                const sessionData = JSON.parse(session);
                if (sessionData.mode === 'demo') {
                    console.log('🎯 Demo mode detected from session');
                    return true;
                }
            }
        } catch (e) {
            console.error('Session check error:', e);
        }
        
        return false;
    }
    
    // デモデータを返す関数
    function getDemoData(tableName, filters = {}) {
        if (!isDemoMode()) {
            console.log('🎯 getDemoData: Not in demo mode');
            return null;
        }
        
        let data = DEMO_DATA[tableName] || [];
        console.log(`🎯 getDemoData: ${tableName}`, data.length, 'records');
        
        // フィルター適用
        if (Object.keys(filters).length > 0) {
            data = data.filter(item => {
                return Object.entries(filters).every(([key, value]) => {
                    if (key === 'eq') {
                        return Object.entries(value).every(([field, fieldValue]) => {
                            // ネストされたフィールドの処理（例: recruitment_stages.stage）
                            if (field.includes('.')) {
                                const [parent, child] = field.split('.');
                                if (Array.isArray(item[parent])) {
                                    return item[parent].some(subItem => subItem[child] === fieldValue);
                                } else if (item[parent]) {
                                    return item[parent][child] === fieldValue;
                                }
                                return false;
                            }
                            return item[field] === fieldValue;
                        });
                    }
                    if (key === 'in') {
                        return Object.entries(value).every(([field, fieldValues]) => {
                            // ネストされたフィールドの処理（例: recruitment_stages.stage）
                            if (field.includes('.')) {
                                const [parent, child] = field.split('.');
                                if (Array.isArray(item[parent])) {
                                    return item[parent].some(subItem => fieldValues.includes(subItem[child]));
                                } else if (item[parent]) {
                                    return fieldValues.includes(item[parent][child]);
                                }
                                return false;
                            }
                            return fieldValues.includes(item[field]);
                        });
                    }
                    return true;
                });
            });
        }
        
        return data;
    }
    
    // Supabaseクライアントをデモモード用にオーバーライド
    function setupDemoSupabase() {
        console.log('🎯 setupDemoSupabase called');
        
        if (!isDemoMode()) {
            console.log('🎯 Not in demo mode, skipping setup');
            return;
        }
        
        // Supabaseクライアントが存在するまで待つ
        function waitForSupabase() {
            if (!window.SUPABASE_CLIENT) {
                console.log('🎯 Waiting for SUPABASE_CLIENT...');
                setTimeout(waitForSupabase, 50);
                return;
            }
            
            console.log('🎯 SUPABASE_CLIENT found, setting up demo override...');
            
            // 既にオーバーライド済みの場合はスキップ
            if (window.SUPABASE_CLIENT._demoOverridden) {
                console.log('🎯 Demo Supabase client already overridden');
                return;
            }
            
            // オリジナルのfromメソッドを保存
            const originalFrom = window.SUPABASE_CLIENT.from.bind(window.SUPABASE_CLIENT);
            window.SUPABASE_CLIENT._originalFrom = originalFrom;
            window.SUPABASE_CLIENT._demoOverridden = true;
            
            // fromメソッドをオーバーライド
            window.SUPABASE_CLIENT.from = function(tableName) {
                console.log(`🎯 Demo query: ${tableName}`);
                
                const queryBuilder = {
                    tableName: tableName,
                    columns: '*',
                    filters: {},
                    orderBy: null,
                    limitCount: null,
                    isSingle: false,
                    
                    select: function(columns = '*') {
                        this.columns = columns;
                        return this;
                    },
                    
                    insert: function(data) {
                        console.log(`🎯 Demo insert blocked: ${tableName}`, data);
                        return Promise.resolve({
                            data: Array.isArray(data) ? data : [data],
                            error: null
                        });
                    },
                    
                    update: function(data) {
                        console.log(`🎯 Demo update blocked: ${tableName}`, data);
                        this.updateData = data;
                        return this;
                    },
                    
                    delete: function() {
                        console.log(`🎯 Demo delete blocked: ${tableName}`);
                        return this;
                    },
                    
                    eq: function(column, value) {
                        this.filters = this.filters || {};
                        this.filters.eq = this.filters.eq || {};
                        this.filters.eq[column] = value;
                        return this;
                    },
                    
                    in: function(column, values) {
                        this.filters = this.filters || {};
                        this.filters.in = this.filters.in || {};
                        this.filters.in[column] = values;
                        return this;
                    },
                    
                    order: function(column, options = {}) {
                        this.orderBy = { column, ...options };
                        return this;
                    },
                    
                    limit: function(count) {
                        this.limitCount = count;
                        return this;
                    },
                    
                    single: function() {
                        this.isSingle = true;
                        return this;
                    },
                    
                    then: function(onResolve, onReject) {
                        return new Promise((resolve) => {
                            let data = getDemoData(this.tableName, this.filters);
                            
                            if (!data) {
                                resolve({ data: [], error: null });
                                return;
                            }
                            
                            // ソート適用
                            if (this.orderBy) {
                                data.sort((a, b) => {
                                    const aVal = a[this.orderBy.column];
                                    const bVal = b[this.orderBy.column];
                                    
                                    if (this.orderBy.ascending === false) {
                                        return bVal > aVal ? 1 : -1;
                                    }
                                    return aVal > bVal ? 1 : -1;
                                });
                            }
                            
                            // リミット適用
                            if (this.limitCount) {
                                data = data.slice(0, this.limitCount);
                            }
                            
                            // 単一レコード
                            if (this.isSingle) {
                                data = data[0] || null;
                            }
                            
                            console.log(`🎯 Demo query result: ${this.tableName}`, data);
                            resolve({ data, error: null });
                        }).then(onResolve, onReject);
                    }
                };
                
                return queryBuilder;
            };
            
            console.log('🎯 Demo Supabase client ready');
            notifyDemoReady();
        }
        
        // Supabaseクライアントの初期化を待つ
        waitForSupabase();
    }
    
    // デモデータ読み込み完了を通知
    function notifyDemoReady() {
        // カスタムイベントを発火
        const event = new CustomEvent('demoDataReady', {
            detail: { demoData: DEMO_DATA }
        });
        document.dispatchEvent(event);
    }
    
    // 初期化（改善版）
    function init() {
        console.log('🎯 Demo data system initializing...');
        
        // URLにdemoパラメータがある場合は即座にセットアップ
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('demo')) {
            console.log('🎯 Demo parameter found in URL, setting up immediately');
            setupDemoSupabase();
        } else if (isDemoMode()) {
            console.log('🎯 Demo mode detected, setting up...');
            setupDemoSupabase();
        } else {
            console.log('🎯 Not in demo mode');
        }
    }
    
    // グローバル関数としてエクスポート
    window.DemoData = {
        getDemoData,
        DEMO_DATA,
        isDemoMode,
        setupDemoSupabase // 外部から呼び出せるようにする
    };
    
    // 即座に初期化を試みる
    init();
    
    // DOMContentLoadedでも初期化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    }
    
    // authCompleteイベントを監視
    document.addEventListener('authComplete', function(e) {
        console.log('🎯 Auth complete event received in demo-data.js', e.detail);
        if (e.detail && e.detail.mode === 'demo') {
            console.log('🎯 Demo mode detected on auth complete, setting up...');
            setupDemoSupabase();
        }
    });
    
    // Vercel環境での追加の初期化タイミング
    // ページ読み込み後に再度チェック
    window.addEventListener('load', function() {
        setTimeout(function() {
            if (isDemoMode() && window.SUPABASE_CLIENT && !window.SUPABASE_CLIENT._demoOverridden) {
                console.log('🎯 Late initialization for demo mode on Vercel');
                setupDemoSupabase();
            }
        }, 100);
    });
})();