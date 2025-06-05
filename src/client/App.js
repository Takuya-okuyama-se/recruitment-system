import React, { useState, useEffect } from 'react';
import './App.css';

// 採用フロー可視化コンポーネント
const RecruitmentPipeline = () => {
  const [pipelineData, setPipelineData] = useState({ stages: [], durations: [] });

  useEffect(() => {
    fetch('http://localhost:5000/api/recruitment/overview')
      .then(res => res.json())
      .then(data => setPipelineData(data));
  }, []);

  return (
    <div className="pipeline-container">
      <h2>採用プロセス全体像</h2>
      <div className="pipeline">
        {pipelineData.stages.map((stage, index) => (
          <div key={stage.id} className="stage-card">
            <h3>{stage.name}</h3>
            <div className="metrics">
              <div className="metric">
                <span className="label">候補者数</span>
                <span className="value">{stage.total_candidates}名</span>
              </div>
              <div className="metric">
                <span className="label">通過率</span>
                <span className="value pass-rate">{stage.pass_rate}%</span>
              </div>
              {pipelineData.durations.find(d => d.stage_name === stage.name) && (
                <div className="metric">
                  <span className="label">平均日数</span>
                  <span className="value">
                    {Math.round(pipelineData.durations.find(d => d.stage_name === stage.name).avg_days)}日
                  </span>
                </div>
              )}
            </div>
            {index < pipelineData.stages.length - 1 && (
              <div className="arrow">→</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// 部門別採用状況
const DepartmentMetrics = () => {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/recruitment/by-department')
      .then(res => res.json())
      .then(data => setDepartments(data));
  }, []);

  return (
    <div className="department-metrics">
      <h2>部門別採用進捗</h2>
      <table>
        <thead>
          <tr>
            <th>部門</th>
            <th>募集職種数</th>
            <th>目標採用数</th>
            <th>応募者数</th>
            <th>採用決定数</th>
            <th>達成率</th>
          </tr>
        </thead>
        <tbody>
          {departments.map(dept => (
            <tr key={dept.department}>
              <td>{dept.department}</td>
              <td>{dept.open_positions}</td>
              <td>{dept.target_hires}</td>
              <td>{dept.total_candidates}</td>
              <td>{dept.hired}</td>
              <td>
                <span className={`achievement ${dept.hired / dept.target_hires >= 0.8 ? 'good' : 'warning'}`}>
                  {dept.target_hires > 0 ? Math.round((dept.hired / dept.target_hires) * 100) : 0}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// 採用チャネル分析
const SourceAnalytics = () => {
  const [sources, setSources] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/recruitment/sources')
      .then(res => res.json())
      .then(data => setSources(data));
  }, []);

  return (
    <div className="source-analytics">
      <h2>採用チャネル効果分析</h2>
      <div className="source-cards">
        {sources.map(source => (
          <div key={source.source} className="source-card">
            <h4>{source.source || '未設定'}</h4>
            <div className="source-metrics">
              <div>応募数: {source.total_applications}</div>
              <div>採用数: {source.hired}</div>
              <div className="conversion">転換率: {source.conversion_rate}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// メインアプリケーション
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>採用管理システム採用管理システム</h1>
        <p>採用プロセスの可視化と効率化</p>
      </header>
      
      <main className="dashboard">
        <RecruitmentPipeline />
        <div className="metrics-row">
          <DepartmentMetrics />
          <SourceAnalytics />
        </div>
      </main>
    </div>
  );
}

export default App;