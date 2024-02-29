import React, { useState } from 'react';
import OpenAI from 'openai';

const Help = () => {
  const [messages, setMessages] = useState([]);
  const apiKey = 

  const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

  const handleUserMessage = async (message) => {
    setMessages([...messages, { id: messages.length + 1, user: true, text: message }]);

    try {
      const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: message }],
        model: "gpt-3.5-turbo",
      });

      const botResponse = completion.choices[0].message.content;

      setMessages([...messages, { id: messages.length + 2, user: false, text: botResponse }]);
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
    }
  };

  return (
    <div className="help-container">
      <div className="chat-window">
        {messages.map((message) => (
          <div key={message.id} className={message.user ? 'user-message' : 'bot-message'}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Type your message here..."
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleUserMessage(e.target.value);
              e.target.value = '';
            }
          }}
        />
      </div>
    </div>
  );
};

export default Help;
