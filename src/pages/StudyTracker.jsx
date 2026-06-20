import { useState } from "react";
import { Plus, Trash2, BookOpen, Star, Award, Clock, Brain } from "lucide-react";
import useLocalStorage from "../hooks/useLocalStorage";
import { INITIAL_TOPICS } from "../utils/mockData";
import Card from "../components/Card";
import Button from "../components/Button";
import { calculateRetention, getForgetRisk } from "../utils/decayEngine";

const StudyTracker = () => {
  const [topics, setTopics] = useLocalStorage("topics", INITIAL_TOPICS);

  // Form states
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [duration, setDuration] = useState("");
  const [confidenceScore, setConfidenceScore] = useState(3);
  const [quizScore, setQuizScore] = useState("");

  // Handle adding a new topic study session
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !duration || !quizScore) {
      alert("Please fill out all fields before logging.");
      return;
    }

    const newTopic = {
      id: `topic-${Date.now()}`,
      title: title.trim(),
      lastStudied: new Date().toISOString().split("T")[0], // sets today's date format (YYYY-MM-DD)
      duration: parseInt(duration),
      confidenceScore: parseInt(confidenceScore),
      quizScore: Math.min(100, Math.max(0, parseInt(quizScore))),
      revisionCount: 0,
      difficulty
    };

    setTopics([newTopic, ...topics]);

    // Reset Form
    setTitle("");
    setDifficulty("Medium");
    setDuration("");
    setConfidenceScore(3);
    setQuizScore("");
  };

  // Handle deleting a topic
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this study topic?")) {
      setTopics(topics.filter((topic) => topic.id !== id));
    }
  };

  // Increment Revision Count
  const incrementRevision = (id) => {
    setTopics(
      topics.map((topic) => {
        if (topic.id === id) {
          return {
            ...topic,
            revisionCount: topic.revisionCount + 1,
            lastStudied: new Date().toISOString().split("T")[0] // Revise updates the last studied date to today!
          };
        }
        return topic;
      })
    );
  };

  // Decrement Revision Count
  const decrementRevision = (id) => {
    setTopics(
      topics.map((topic) => {
        if (topic.id === id) {
          return {
            ...topic,
            revisionCount: Math.max(0, topic.revisionCount - 1)
          };
        }
        return topic;
      })
    );
  };

  // Calculations are now delegated to the centralized decayEngine.js utility

  return (
    <div className="tracker-page">
      <div className="tracker-header">
        <h1>Study Tracker</h1>
        <p className="subtitle">Log your study parameters to update knowledge decay estimates.</p>
      </div>

      <div className="tracker-layout">
        {/* Left Side: Add Topic Form */}
        <div className="tracker-form-side">
          <Card title="Log New Study Session">
            <form onSubmit={handleSubmit} className="study-form">
              <div className="form-group">
                <label htmlFor="topic-title">Topic Title</label>
                <input
                  type="text"
                  id="topic-title"
                  placeholder="e.g., Dynamic Programming, Trees"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="difficulty">Difficulty</label>
                  <select
                    id="difficulty"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="duration">Duration (min)</label>
                  <input
                    type="number"
                    id="duration"
                    placeholder="e.g., 60"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="confidence">Confidence (1-5)</label>
                  <select
                    id="confidence"
                    value={confidenceScore}
                    onChange={(e) => setConfidenceScore(parseInt(e.target.value))}
                  >
                    <option value="1">1 - Very Low</option>
                    <option value="2">2 - Low</option>
                    <option value="3">3 - Medium</option>
                    <option value="4">4 - High</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="quiz">Quiz Score (%)</label>
                  <input
                    type="number"
                    id="quiz"
                    placeholder="e.g., 85"
                    value={quizScore}
                    onChange={(e) => setQuizScore(e.target.value)}
                    min="0"
                    max="100"
                    required
                  />
                </div>
              </div>

              <Button type="submit" variant="primary" className="form-submit-btn">
                <Plus size={16} style={{ marginRight: "6px" }} /> Log Activity
              </Button>
            </form>
          </Card>
        </div>

        {/* Right Side: Topics Log List */}
        <div className="tracker-list-side">
          <Card title="Active Learning Catalog">
            {topics.length === 0 ? (
              <div className="empty-panel text-center py-6">
                <BookOpen size={48} className="text-muted mb-2" />
                <p>No study logs detected. Use the form to start logging!</p>
              </div>
            ) : (
              <div className="topics-log-list">
                {topics.map((topic) => {
                  const retention = calculateRetention(topic);
                  const riskObj = getForgetRisk(retention);
                  const risk = riskObj.category;
                  return (
                    <div key={topic.id} className="topic-log-card">
                      <div className="topic-log-header">
                        <div>
                          <h4 className="topic-log-title">{topic.title}</h4>
                          <span className={`badge-diff diff-${topic.difficulty.toLowerCase()}`}>
                            {topic.difficulty}
                          </span>
                        </div>
                        <span className={`badge badge-${risk.toLowerCase()}`}>
                          {risk} Risk
                        </span>
                      </div>

                      <div className="topic-log-details">
                        <div className="detail-item">
                          <Clock size={14} className="text-muted" />
                          <span>{topic.duration} mins</span>
                        </div>
                        <div className="detail-item">
                          <Star size={14} className="text-warning" />
                          <span>Conf: {topic.confidenceScore}/5</span>
                        </div>
                        <div className="detail-item">
                          <Award size={14} className="text-accent" />
                          <span>Quiz: {topic.quizScore}%</span>
                        </div>
                        <div className="detail-item">
                          <Brain size={14} className="text-primary" />
                          <span className="font-bold">Ret: {retention}%</span>
                        </div>
                      </div>

                      <div className="topic-log-actions">
                        <div className="revision-pill">
                          <span className="revision-label">Revisions: {topic.revisionCount}</span>
                          <button
                            onClick={() => decrementRevision(topic.id)}
                            className="rev-btn"
                            title="Decrease Revisions"
                          >
                            -
                          </button>
                          <button
                            onClick={() => incrementRevision(topic.id)}
                            className="rev-btn"
                            title="Mark as Revised Today"
                          >
                            +
                          </button>
                        </div>
                        
                        <div className="right-action-buttons">
                          <span className="last-studied-date">
                            Last studied: {topic.lastStudied}
                          </span>
                          <button
                            onClick={() => handleDelete(topic.id)}
                            className="delete-topic-btn"
                            title="Delete topic"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudyTracker;
