-- 会社採用管理システム データベーススキーマ

-- 部門マスタ
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    name_en VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 職種マスタ
CREATE TABLE job_positions (
    id SERIAL PRIMARY KEY,
    department_id INTEGER REFERENCES departments(id),
    title VARCHAR(200) NOT NULL,
    title_en VARCHAR(200),
    requirements TEXT,
    target_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 採用ステージマスタ
CREATE TABLE recruitment_stages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    name_en VARCHAR(50),
    stage_order INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- 候補者情報
CREATE TABLE candidates (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    current_company VARCHAR(200),
    years_of_experience INTEGER,
    education TEXT,
    languages TEXT,
    applied_position_id INTEGER REFERENCES job_positions(id),
    source VARCHAR(50), -- リクルーター, 転職サイト, 自社サイト等
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 採用プロセス
CREATE TABLE recruitment_processes (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id),
    stage_id INTEGER REFERENCES recruitment_stages(id),
    status VARCHAR(20) DEFAULT 'in_progress', -- in_progress, passed, failed, withdrawn
    entered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    days_in_stage INTEGER GENERATED ALWAYS AS (
        CASE 
            WHEN completed_at IS NOT NULL 
            THEN EXTRACT(DAY FROM (completed_at - entered_at))
            ELSE NULL 
        END
    ) STORED,
    notes TEXT
);

-- 面接評価
CREATE TABLE interview_evaluations (
    id SERIAL PRIMARY KEY,
    process_id INTEGER REFERENCES recruitment_processes(id),
    interviewer_name VARCHAR(100) NOT NULL,
    interview_date DATE NOT NULL,
    technical_score INTEGER CHECK (technical_score >= 1 AND technical_score <= 5),
    communication_score INTEGER CHECK (communication_score >= 1 AND communication_score <= 5),
    culture_fit_score INTEGER CHECK (culture_fit_score >= 1 AND culture_fit_score <= 5),
    overall_recommendation VARCHAR(20), -- strong_yes, yes, neutral, no, strong_no
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 採用オファー
CREATE TABLE job_offers (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id),
    position_id INTEGER REFERENCES job_positions(id),
    salary_offered DECIMAL(12, 2),
    start_date DATE,
    offer_sent_date DATE,
    response_deadline DATE,
    status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, rejected, negotiating
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 初期データ投入
INSERT INTO recruitment_stages (name, name_en, stage_order) VALUES
('書類選考', 'Resume Screening', 1),
('一次面接', 'First Interview', 2),
('適性検査', 'Aptitude Test', 3),
('最終面接', 'Final Interview', 4),
('内定', 'Job Offer', 5);

INSERT INTO departments (name, name_en) VALUES
('研究開発本部', 'R&D Division'),
('生産技術部', 'Production Technology'),
('品質保証部', 'Quality Assurance'),
('マーケティング部', 'Marketing'),
('人事総務部', 'HR & General Affairs');