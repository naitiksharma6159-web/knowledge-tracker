import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, HelpCircle, Sparkles } from "lucide-react";
import useLocalStorage from "../hooks/useLocalStorage";
import { CHAT_BOT_ANSWERS, INITIAL_TOPICS } from "../utils/mockData";
import Card from "../components/Card";
import Button from "../components/Button";
import { getDaysElapsed, calculateRetention, getForgetRisk, getRevisionRecommendations } from "../utils/decayEngine";

const ChatAssistant = () => {
  const [topics] = useLocalStorage("topics", INITIAL_TOPICS);
  const [messages, setMessages] = useLocalStorage("chat-messages", [
    {
      id: "welcome",
      sender: "bot",
      text: "Hello! I am your Smart Revision Assistant. I can help explain cognitive forgetting risks, explain study recommendations, and provide navigation help. Ask me anything!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputVal, setInputVal] = useState("");
  const chatBottomRef = useRef(null);

  // Auto-scroll to the bottom of the conversation pane
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Dynamically generate answers based on user study logs
  const generateDynamicResponse = (queryLower) => {
    // 1. Recommendations and priorities
    if (
      queryLower.includes("recommend") ||
      queryLower.includes("what should i revise") ||
      queryLower.includes("what to revise") ||
      queryLower.includes("what should i study") ||
      queryLower.includes("study plan") ||
      queryLower.includes("revision plan") ||
      queryLower.includes("revision queue") ||
      queryLower.includes("what to study")
    ) {
      const recommendations = getRevisionRecommendations(topics);
      if (recommendations.length === 0) {
        return "You have no topics logged in your tracker yet. Go to the Study Tracker page to log your first study session!";
      }

      const topRecs = recommendations.slice(0, 3);
      let reply = "Based on your study parameters and forgetting curves, here are your top revision priorities:\n\n";
      topRecs.forEach((rec, index) => {
        reply += `${index + 1}. **${rec.title}**\n`;
        reply += `   • **Memory Retention**: ${rec.retentionVal}%\n`;
        reply += `   • **Forget Risk**: ${rec.risk} Risk (${rec.riskScore}% risk)\n`;
        reply += `   • **Last Studied**: ${rec.daysElapsed} days ago. (Quiz: ${rec.quizScore}%, Confidence: ${rec.confidenceScore}/5)\n\n`;
      });
      reply += "You can mark any topic as revised on the **Study Tracker** to reset its decay and boost your memory retention score!";
      return reply;
    }

    // 2. Specific topic check
    const matchedTopic = topics.find((t) => {
      const titleLower = t.title.toLowerCase();
      // Exact match or includes full title
      if (queryLower.includes(titleLower)) return true;
      // Or split title into words and check if user queries significant words (length > 3)
      const words = titleLower.split(/[\s-]/).filter((w) => w.length > 3);
      return words.length > 0 && words.some((w) => queryLower.includes(w));
    });

    if (matchedTopic) {
      const retention = calculateRetention(matchedTopic);
      const riskObj = getForgetRisk(retention);
      const daysElapsed = getDaysElapsed(matchedTopic.lastStudied);

      let explanation = `Here is your current memory profile for **${matchedTopic.title}**:\n\n`;
      explanation += `• **Memory Retention**: **${retention}%**\n`;
      explanation += `• **Forgetting Risk**: **${riskObj.category} Risk** (${riskObj.score}% probability of forgetting)\n`;
      explanation += `• **Last Studied**: ${daysElapsed} days ago (${matchedTopic.lastStudied})\n`;
      explanation += `• **Revisions Count**: ${matchedTopic.revisionCount} revisions logged\n`;
      explanation += `• **Study Quality**: Quiz Score: ${matchedTopic.quizScore}%, Confidence Score: ${matchedTopic.confidenceScore}/5\n\n`;

      explanation += "**Analysis & Diagnosis**:\n";
      if (riskObj.category === "High") {
        explanation += `⚠️ **High Risk Alert**: Your memory strength for this topic is low. You studied it ${daysElapsed} days ago and scored ${matchedTopic.quizScore}% on your quiz. Because this is a **${matchedTopic.difficulty}** difficulty topic, it decays rapidly. I highly recommend revising it today!`;
      } else if (riskObj.category === "Medium") {
        explanation += `⏳ **Decaying**: Your memory is fading. Although you have logged ${matchedTopic.revisionCount} revisions, the elapsed time (${daysElapsed} days) is starting to degrade your recall. A quick review session will stabilize it back to 100%.`;
      } else {
        explanation += `✅ **Well Retained**: You have excellent retention for this topic! This is due to a high quiz score (${matchedTopic.quizScore}%) and active revisions. You do not need to revise this topic immediately.`;
      }
      return explanation;
    }

    // 3. Forgetting risk formula explanation
    if (
      queryLower.includes("how is risk calculated") ||
      queryLower.includes("forgetting risk") ||
      queryLower.includes("calculate") ||
      queryLower.includes("formula") ||
      queryLower.includes("risk score") ||
      queryLower.includes("ebbinghaus") ||
      queryLower.includes("decay")
    ) {
      return `Our **Knowledge Decay Engine** estimates memory retention and forget-risk using a model based on the Ebbinghaus Forgetting Curve:\n\n` +
             `1. **Baseline Memory**: Determined by your quiz score (60% weight) and confidence rating (40% weight).\n` +
             `2. **Decay Over Time**: Memory decays every day since your last study session. Harder topics decay much faster than easy ones.\n` +
             `3. **Spaced Repetition Boost**: Every time you log a revision, the rate of decay slows down, flattening the forgetting curve and keeping the memory stable for longer.\n` +
             `4. **Forget Risk Classification**:\n` +
             `   • **High Risk**: Retention drops below 40% (Risk >= 60%).\n` +
             `   • **Medium Risk**: Retention is between 40% and 70%.\n` +
             `   • **Low Risk**: Retention is 70% or higher.`;
    }

    // 4. Default fallback: search static answers in mockData or return default guide
    const matchedStatic = CHAT_BOT_ANSWERS.find((item) =>
      item.keywords.some((keyword) => queryLower.includes(keyword))
    );

    if (matchedStatic) {
      return matchedStatic.answer;
    }

    return "I couldn't locate specific metrics for that query. You can ask me questions like:\n" +
           "• *'Why should I revise Dynamic Programming?'*\n" +
           "• *'What should I revise today?'*\n" +
           "• *'How is my forgetting risk calculated?'*\n" +
           "• *'Guide me on how to use this platform'*";
  };

  // Handle query processing
  const processQuery = (userText) => {
    const queryLower = userText.toLowerCase();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setTimeout(() => {
      const botText = generateDynamicResponse(queryLower);

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${prev.length}`,
          sender: "bot",
          text: botText,
          timestamp
        }
      ]);
    }, 600); // Small delay to simulate computation
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const messageText = inputVal.trim();

    setMessages((prev) => [
      ...prev,
      {
        id: `user-${prev.length}`,
        sender: "user",
        text: messageText,
        timestamp
      }
    ]);
    setInputVal("");
    processQuery(messageText);
  };

  // Quick suggestion click handler
  const handleSuggestionClick = (suggestionText) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [
      ...prev,
      {
        id: `user-${prev.length}`,
        sender: "user",
        text: suggestionText,
        timestamp
      }
    ]);
    processQuery(suggestionText);
  };

  // Clear Chat History
  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear chat history?")) {
      setMessages([
        {
          id: "welcome",
          sender: "bot",
          text: "Hello! I am your Smart Revision Assistant. I can help explain cognitive forgetting risks, explain study recommendations, and provide navigation help. Ask me anything!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  const suggestions = [
    "Why should I revise Dynamic Programming?",
    "How is my forgetting risk calculated?",
    "Guide me on how to use this platform",
    "Why revise virtual memory?"
  ];

  return (
    <div className="chat-page">
      <div className="chat-header">
        <div>
          <h1>Smart Study Assistant</h1>
          <p className="subtitle">Ask questions regarding forgetting forecasting, revision plans, and concepts.</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleClearHistory}>
          Clear History
        </Button>
      </div>

      <div className="chat-layout">
        {/* Left Side: Conversation Area */}
        <div className="chat-main">
          <Card className="chat-box-card">
            <div className="chat-messages-container">
              {messages.map((msg) => (
                <div key={msg.id} className={`chat-message-wrapper ${msg.sender === "bot" ? "bot" : "user"}`}>
                  <div className="message-avatar">
                    {msg.sender === "bot" ? (
                      <Bot size={18} className="text-primary" />
                    ) : (
                      <User size={18} className="text-accent" />
                    )}
                  </div>
                  <div className="message-bubble">
                    <p className="message-text">{msg.text}</p>
                    <span className="message-time">{msg.timestamp}</span>
                  </div>
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>

            <form onSubmit={handleSendMessage} className="chat-input-form">
              <input
                type="text"
                placeholder="Ask a question..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                required
              />
              <button type="submit" className="chat-send-btn" title="Send message">
                <Send size={18} />
              </button>
            </form>
          </Card>
        </div>

        {/* Right Side: Suggested Prompts */}
        <div className="chat-suggestions-sidebar">
          <Card title="Quick Recommendations">
            <div className="suggestions-list">
              <p className="suggestion-intro-text">
                <Sparkles size={14} className="text-primary" style={{ marginRight: '6px' }} />
                Click a query card to receive immediate explanations:
              </p>
              {suggestions.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(sug)}
                  className="suggestion-item-card"
                >
                  <HelpCircle size={14} className="text-muted" />
                  <span>{sug}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;
