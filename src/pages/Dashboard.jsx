import React from "react";
import { Link } from "react-router-dom";
import { Brain, Flame, Clock, AlertTriangle, Calendar, Award, TrendingUp } from "lucide-react";
import useLocalStorage from "../hooks/useLocalStorage";
import { INITIAL_TOPICS } from "../utils/mockData";
import Card from "../components/Card";
import Button from "../components/Button";

const Dashboard = () => {
  const [topics] = useLocalStorage("topics", INITIAL_TOPICS);

  // Helper: calculate days elapsed since last studied date
  const getDaysElapsed = (dateString) => {
    const lastDate = new Date(dateString);
    const currentDate = new Date("2026-06-20"); // Using current system date from mock constraints
    const diffTime = Math.abs(currentDate - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 0;
  };

  // Helper: determine topic risk category
  const calculateTopicRisk = (topic) => {
    const daysElapsed = getDaysElapsed(topic.lastStudied);
    
    // HEURISTIC: high decay factors depend on elapsed time, low quiz marks, or low self-rated confidence
    if (topic.confidenceScore <= 2 || topic.quizScore < 60 || daysElapsed > 7) {
      return "High";
    } else if (topic.confidenceScore === 3 || (topic.quizScore >= 60 && topic.quizScore < 80) || daysElapsed >= 4) {
      return "Medium";
    } else {
      return "Low";
    }
  };

  // Compute stats dynamically
  let totalRetentionSum = 0;
  let highRiskCount = 0;
  let medRiskCount = 0;
  let lowRiskCount = 0;
  const highRiskTopics = [];
  const upcomingRevisions = [];

  topics.forEach((topic) => {
    const daysElapsed = getDaysElapsed(topic.lastStudied);
    const risk = calculateTopicRisk(topic);

    // Heuristic Memory Retention Score calculation
    const decayFactor = Math.max(0.4, 1 - daysElapsed * 0.06); // 6% memory decay per day elapsed, floor at 40%
    const baseScore = (topic.quizScore * 0.6) + (topic.confidenceScore * 8); // Weighted scale (max 60 + 40 = 100)
    const retentionVal = Math.round(baseScore * decayFactor);
    totalRetentionSum += retentionVal;

    if (risk === "High") {
      highRiskCount++;
      highRiskTopics.push({ ...topic, retentionVal });
    } else if (risk === "Medium") {
      medRiskCount++;
    } else {
      lowRiskCount++;
    }

    // Schedule revision if days elapsed > 2
    if (daysElapsed >= 2 || risk === "High") {
      upcomingRevisions.push({ ...topic, daysElapsed, risk });
    }
  });

  const averageRetention = topics.length > 0 ? Math.round(totalRetentionSum / topics.length) : 0;

  // Streak tracker
  const [streak] = useLocalStorage("streak", 5);

  // SVG dimensions for Weekly Study Hours graph
  const barData = [
    { day: "Mon", hours: 2.0 },
    { day: "Tue", hours: 1.5 },
    { day: "Wed", hours: 3.0 },
    { day: "Thu", hours: 0.5 },
    { day: "Fri", hours: 4.0 },
    { day: "Sat", hours: 1.2 },
    { day: "Sun", hours: 2.5 }
  ];
  const maxHours = 5;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Revision Command Center</h1>
          <p className="subtitle">Real-time memory stats & simulated forgetting forecasts.</p>
        </div>
        <div className="date-badge">
          <Calendar size={16} />
          <span>June 20, 2026</span>
        </div>
      </div>

      {/* Grid: 4 Metric Cards */}
      <div className="metrics-grid">
        <Card className="metric-card">
          <div className="metric-icon bg-primary-light">
            <Brain className="text-primary" size={24} />
          </div>
          <div className="metric-details">
            <span className="metric-title">Memory Retention</span>
            <span className="metric-number text-primary">{averageRetention}%</span>
            <span className="metric-subtitle">Heuristic forecast index</span>
          </div>
        </Card>

        <Card className="metric-card">
          <div className="metric-icon bg-accent-light">
            <Flame className="text-accent" size={24} />
          </div>
          <div className="metric-details">
            <span className="metric-title">Study Streak</span>
            <span className="metric-number text-accent">{streak} Days</span>
            <span className="metric-subtitle">Active daily study streak</span>
          </div>
        </Card>

        <Card className="metric-card">
          <div className="metric-icon bg-danger-light">
            <AlertTriangle className="text-danger" size={24} />
          </div>
          <div className="metric-details">
            <span className="metric-title">High Risk Topics</span>
            <span className="metric-number text-danger">{highRiskCount}</span>
            <span className="metric-subtitle">Need revision immediately</span>
          </div>
        </Card>

        <Card className="metric-card">
          <div className="metric-icon bg-info-light">
            <Clock className="text-info" size={24} />
          </div>
          <div className="metric-details">
            <span className="metric-title">Study Time</span>
            <span className="metric-number text-info">14.7h</span>
            <span className="metric-subtitle">Accumulated this week</span>
          </div>
        </Card>
      </div>

      {/* Core Panels Grid */}
      <div className="dashboard-panels">
        {/* Left Side: SVG Bar chart & Risk distribution */}
        <div className="panels-left">
          {/* Weekly Study Hours SVG Chart */}
          <Card title="Weekly Study Hours">
            <div className="chart-container">
              <svg viewBox="0 0 400 200" className="dashboard-svg-chart">
                {/* Horizontal Guide Lines */}
                {[0, 1, 2, 3, 4, 5].map((val) => (
                  <g key={val}>
                    <line
                      x1="40"
                      y1={160 - val * 26}
                      x2="380"
                      y2={160 - val * 26}
                      stroke="rgba(255, 255, 255, 0.05)"
                      strokeWidth="1"
                    />
                    <text x="15" y={164 - val * 26} fill="rgba(248, 250, 252, 0.4)" fontSize="10">
                      {val}h
                    </text>
                  </g>
                ))}

                {/* Bars */}
                {barData.map((data, index) => {
                  const x = 50 + index * 46;
                  const barHeight = (data.hours / maxHours) * 130;
                  const y = 160 - barHeight;

                  return (
                    <g key={data.day}>
                      {/* Bar Fill */}
                      <rect
                        x={x}
                        y={y}
                        width="24"
                        height={barHeight}
                        rx="4"
                        fill={data.day === "Fri" ? "var(--accent-color)" : "var(--primary-color)"}
                        className="svg-bar"
                      />
                      {/* Hover Tooltip Value */}
                      <text x={x + 12} y={y - 6} fill="white" fontSize="9" textAnchor="middle">
                        {data.hours}
                      </text>
                      {/* Day Label */}
                      <text x={x + 12} y="180" fill="rgba(248, 250, 252, 0.6)" fontSize="11" textAnchor="middle">
                        {data.day}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </Card>

          {/* Risk Category Distribution */}
          <Card title="Forget Risk Distribution">
            <div className="risk-dist">
              <div className="dist-item">
                <div className="dist-label-row">
                  <span>High Risk (Decay Predict)</span>
                  <span className="text-danger font-bold">{highRiskCount}</span>
                </div>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill bg-danger"
                    style={{ width: `${(highRiskCount / topics.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="dist-item">
                <div className="dist-label-row">
                  <span>Medium Risk</span>
                  <span className="text-warning font-bold">{medRiskCount}</span>
                </div>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill bg-warning"
                    style={{ width: `${(medRiskCount / topics.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="dist-item">
                <div className="dist-label-row">
                  <span>Low Risk (Retained)</span>
                  <span className="text-accent font-bold">{lowRiskCount}</span>
                </div>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill bg-accent"
                    style={{ width: `${(lowRiskCount / topics.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side: High Risk Items & Schedule */}
        <div className="panels-right">
          {/* Urgent Revision Priority List */}
          <Card title="Immediate Revisions Recommended">
            {highRiskTopics.length === 0 ? (
              <div className="empty-panel">
                <Award className="text-accent" size={32} />
                <p>Excellent memory score! No topics currently in High Risk decay.</p>
              </div>
            ) : (
              <div className="list-panel-container">
                {highRiskTopics.map((topic) => (
                  <div key={topic.id} className="priority-item-card">
                    <div className="priority-item-info">
                      <h4>{topic.title}</h4>
                      <p>Retention: <span className="text-danger font-bold">{topic.retentionVal}%</span> | Score: {topic.quizScore}%</p>
                    </div>
                    <Link to="/chat">
                      <Button variant="outline" size="sm">Ask Assistant</Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Upcoming Revisions Queue */}
          <Card title="Upcoming Revision Queue">
            {upcomingRevisions.length === 0 ? (
              <p className="text-muted text-center py-4">No upcoming revisions scheduled.</p>
            ) : (
              <div className="list-panel-container">
                {upcomingRevisions.map((rev) => (
                  <div key={rev.id} className="queue-item">
                    <div className="queue-text">
                      <span className="queue-title">{rev.title}</span>
                      <span className="queue-meta">Studied {rev.daysElapsed} days ago</span>
                    </div>
                    <span className={`badge badge-${rev.risk.toLowerCase()}`}>
                      {rev.risk} Risk
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      <div className="dashboard-cta-row">
        <Link to="/tracker">
          <Button variant="primary">
            <TrendingUp size={16} style={{ marginRight: '8px' }} /> Log Study Activity
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
