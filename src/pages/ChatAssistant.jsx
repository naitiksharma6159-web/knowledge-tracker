import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, HelpCircle, Sparkles } from "lucide-react";
import useLocalStorage from "../hooks/useLocalStorage";
import { CHAT_BOT_ANSWERS } from "../utils/mockData";
import Card from "../components/Card";
import Button from "../components/Button";

const ChatAssistant = () => {
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

  // Handle query processing
  const processQuery = (userText) => {
    const queryLower = userText.toLowerCase();
    
    // Find matching mock answer based on keywords
    const matched = CHAT_BOT_ANSWERS.find((item) =>
      item.keywords.some((keyword) => queryLower.includes(keyword))
    );

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setTimeout(() => {
      let botText = "";
      if (matched) {
        botText = matched.answer;
      } else {
        botText = "I couldn't locate specific metrics for that query. For Phase 1, you can try asking: \n• 'Why should I revise Dynamic Programming?'\n• 'Explain forgetting risk calculation rules'\n• 'How to use this platform' \n\nI can retrieve matching summaries as we expand note indices in future phases!";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
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
    const userMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: inputVal.trim(),
      timestamp
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputVal("");
    processQuery(userMessage.text);
  };

  // Quick suggestion click handler
  const handleSuggestionClick = (suggestionText) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: suggestionText,
      timestamp
    };

    setMessages((prev) => [...prev, userMessage]);
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
