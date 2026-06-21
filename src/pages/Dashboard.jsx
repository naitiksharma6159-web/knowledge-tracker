import { useContext } from "react";
import { Link } from "react-router-dom";
import { Brain, Flame, Clock, AlertTriangle, Calendar, Award, TrendingUp, BookOpen, FileText } from "lucide-react";
import useLocalStorage from "../hooks/useLocalStorage";
import { INITIAL_TOPICS } from "../utils/mockData";
import Card from "../components/Card";
import Button from "../components/Button";
import { getRevisionRecommendations } from "../utils/decayEngine";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [topics] = useLocalStorage("topics", INITIAL_TOPICS);
  const [notes] = useLocalStorage("notes", []);


  // Compute stats dynamically using the centralized decay engine
  const annotatedTopics = getRevisionRecommendations(topics);

  const highRiskTopics = annotatedTopics.filter((t) => t.risk === "High");
  const highRiskCount = highRiskTopics.length;
  const medRiskCount = annotatedTopics.filter((t) => t.risk === "Medium").length;
  const lowRiskCount = annotatedTopics.filter((t) => t.risk === "Low").length;

  const totalRetentionSum = annotatedTopics.reduce((sum, topic) => sum + topic.retentionVal, 0);
  const averageRetention = topics.length > 0 ? Math.round(totalRetentionSum / topics.length) : 0;

  // Schedule revision if days elapsed >= 2 or risk is High
  const upcomingRevisions = annotatedTopics.filter((t) => t.daysElapsed >= 2 || t.risk === "High");

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

      {/* Welcome banner & Stats */}
      {user && (
        <Card className="profile-banner-card" style={styles.profileBanner}>
          <div style={styles.profileInfo}>
            <div style={styles.avatar}>
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <h2 style={styles.welcomeTitle}>Welcome back, {user.name}</h2>
              <p style={styles.welcomeSubtitle}>{user.email}</p>
            </div>
          </div>
          <div style={styles.statsContainer}>
            <div style={styles.statBox}>
              <div style={styles.statIconWrapper}>
                <FileText size={18} style={{ color: "#6366f1" }} />
              </div>
              <div>
                <span style={styles.statLabel}>Total Notes</span>
                <span style={styles.statValue}>{notes.length}</span>
              </div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statIconWrapper}>
                <BookOpen size={18} style={{ color: "#a855f7" }} />
              </div>
              <div>
                <span style={styles.statLabel}>Study Sessions</span>
                <span style={styles.statValue}>{topics.length}</span>
              </div>
            </div>
          </div>
        </Card>
      )}

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

const styles = {
  profileBanner: {
    background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px",
  },
  profileInfo: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  avatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "18px",
    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
  },
  welcomeTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#f8fafc",
    margin: 0,
  },
  welcomeSubtitle: {
    fontSize: "14px",
    color: "#cbd5e1",
    margin: "4px 0 0 0",
  },
  statsContainer: {
    display: "flex",
    gap: "24px",
    flexWrap: "wrap",
  },
  statBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "rgba(15, 23, 42, 0.4)",
    padding: "12px 20px",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.04)",
  },
  statIconWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    background: "rgba(255, 255, 255, 0.03)",
  },
  statLabel: {
    display: "block",
    fontSize: "11px",
    fontWeight: "600",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  statValue: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#f8fafc",
  },
};

export default Dashboard;

