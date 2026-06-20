import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Brain, TrendingDown, BookOpen, Clock, Sparkles } from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* 1. Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles className="icon-sparkle" size={16} />
            <span>AI-Driven Memory Retrieval & Tracking</span>
          </div>
          <h1>
            Stop Cramming. Start <span className="highlight-text">Retaining</span>.
          </h1>
          <p>
            Track your learning habits, forecast knowledge decay using advanced ML modeling heuristics, and receive smart, structured revision recommendations.
          </p>
          <div className="hero-cta">
            <Link to="/dashboard">
              <Button size="lg" className="pulse-btn">
                Access Dashboard <ArrowRight size={18} style={{ marginLeft: '8px' }} />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. How It Works Section */}
      <section className="how-it-works-section">
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle">Retain complex concepts in 3 simple steps</p>
        <div className="steps-grid">
          <Card title="1. Log Study Session">
            <div className="step-number">01</div>
            <p>
              Log topics, study durations, quiz scores, and self-reported confidence indices directly into the tracker.
            </p>
          </Card>
          <Card title="2. Predict Decay Risk">
            <div className="step-number">02</div>
            <p>
              The platform utilizes simulated Machine Learning classifiers to predict knowledge decay categories (Low, Medium, High).
            </p>
          </Card>
          <Card title="3. Revise Intelligently">
            <div className="step-number">03</div>
            <p>
              Get personalized scheduling priority and matching text summaries to review exactly when you are close to forgetting.
            </p>
          </Card>
        </div>
      </section>

      {/* 3. Features Section */}
      <section className="features-section">
        <h2 className="section-title">Platform Features</h2>
        <p className="section-subtitle">Everything you need to optimize memory retention</p>
        <div className="features-grid">
          <div className="feature-item">
            <Brain className="feature-icon text-primary" size={32} />
            <h3>Intelligent Tracker</h3>
            <p>Monitor your study counts, difficulties, and retention metrics across all domains in one dashboard.</p>
          </div>
          <div className="feature-item">
            <TrendingDown className="feature-icon text-accent" size={32} />
            <h3>Decay Risk Forecasting</h3>
            <p>Predict cognitive forgetting risk before it happens, optimizing revision sequences to prevent decay.</p>
          </div>
          <div className="feature-item">
            <BookOpen className="feature-icon text-primary" size={32} />
            <h3>Smart Summaries Organizer</h3>
            <p>Upload text summaries and use inverted indexing searches to pull up reference sheets immediately.</p>
          </div>
        </div>
      </section>

      {/* 4. Dashboard Preview Section */}
      <section className="preview-section">
        <h2 className="section-title">Dashboard Preview</h2>
        <p className="section-subtitle">Real-time analytical insights at a glance</p>
        <div className="dashboard-preview-card">
          <div className="preview-header">
            <div className="preview-dots">
              <span className="dot dot-red"></span>
              <span className="dot dot-yellow"></span>
              <span className="dot dot-green"></span>
            </div>
            <span className="preview-title">Knowledge Decay Analytics Panel</span>
          </div>
          <div className="preview-content">
            <div className="preview-metric">
              <span className="metric-label">Memory Retention Score</span>
              <span className="metric-value text-primary">84%</span>
              <div className="metric-bar-bg">
                <div className="metric-bar-fill" style={{ width: '84%' }}></div>
              </div>
            </div>
            <div className="preview-topics">
              <div className="preview-topic-item">
                <span>Dynamic Programming</span>
                <span className="badge badge-high">High Risk</span>
              </div>
              <div className="preview-topic-item">
                <span>Graph Algorithms</span>
                <span className="badge badge-med">Medium Risk</span>
              </div>
              <div className="preview-topic-item">
                <span>Binary Search</span>
                <span className="badge badge-low">Low Risk</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Call To Action Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Start Optimizing Your Learning Today</h2>
          <p>
            Join students who use machine learning heuristics to study smarter, eliminate forgetting, and pass technical interviews with high confidence.
          </p>
          <Link to="/dashboard">
            <Button variant="accent" size="lg">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
