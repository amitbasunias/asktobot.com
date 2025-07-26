import React, { useState, useEffect, useRef } from 'react';

const styles = {
  container: {
    margin: '10px auto',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '300px',
    fontFamily: 'Arial, sans-serif',
    color: 'white',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  },
  messages: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  message: {
    maxWidth: '75%',
    padding: '12px 18px',
    borderRadius: '25px',
    fontSize: '15px',
    lineHeight: 1.4,
    whiteSpace: 'pre-wrap',
    boxShadow: '0 4px 15px rgba(255,255,255,0.1)',
  },
  userMessage: {
    alignSelf: 'flex-end',
    color: '#000',
    borderBottomRightRadius: '4px',
  },
  botMessage: {
    alignSelf: 'flex-start',
    background: 'rgba(255,255,255,0.15)',
    color: 'black',
    borderBottomLeftRadius: '4px',
  },
  inputContainer: {
    padding: '15px 20px',
    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
    display: 'flex',
    gap: '10px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderBottomLeftRadius: '20px',
    borderBottomRightRadius: '20px',
  },
  input: {
    flex: 1,
    padding: '12px 15px',
    borderRadius: '30px',
    border: 'none',
    background: 'rgba(255, 255, 255, 0.15)',
    color: 'black',
    fontSize: '16px',
    outline: 'none',
    boxShadow: 'inset 0 0 8px rgba(27, 5, 5, 0.3)',
  },
};

const ChatBot = ({ resultSummary, serviceName }) => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! Ask me anything about your calculation.' },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const appendMessage = (text, sender = 'bot') => {
    setMessages((prev) => [...prev, { text, sender }]);
  };

  const sendQuestion = async (question) => {
    appendMessage(question, 'user');
    appendMessage('Thinking...', 'bot');

const summary = resultSummary || 'No result provided';
console.log(summary);


    try {
      const res = await fetch('https://asktobot.amitbsnia.workers.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: serviceName || 'Calculator',
          result: summary,
          question,
        }),
      });

      const data = await res.json();
      console.log(data);
      updateLastBotMessage(data.answer || 'Sorry, no answer received.');
    } catch (err) {
      console.error(err);
      updateLastBotMessage("Error: Couldn't get a response. Try again.");
    }
  };

 const updateLastBotMessage = (newText) => {
  setMessages((prev) => {
    const copy = [...prev];
    const idx = copy.findIndex((msg) => msg.sender === 'bot' && msg.text === 'Thinking...');
    if (idx !== -1) {
      copy[idx] = { ...copy[idx], text: newText };
    }
    return copy;
  });
};


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendQuestion(input.trim());
    setInput('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={{ paddingBottom: '0px', marginBottom: '10px' }}>
      <h2 style={{ textAlign: 'center' }}>Ask To Bot</h2>
      <p style={{ textAlign: 'center' }}>
        Ask our trained bot, who will help you clarify everything.
      </p>

      <div style={styles.container} role="region" aria-label="AskToBot Chatbot interface">
        <div style={styles.messages}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                ...styles.message,
                ...(msg.sender === 'user' ? styles.userMessage : styles.botMessage),
              }}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form style={styles.inputContainer} onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            placeholder="Type your question and press Enter..."
            autoComplete="off"
            spellCheck="false"
            required
            aria-label="Chat input"
            onChange={(e) => setInput(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={{ display: 'none' }} aria-label="Send message">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;
