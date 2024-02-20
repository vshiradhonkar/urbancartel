// Help.jsx
import React from 'react';
import ChatBot from 'react-simple-chatbot';

const Help = () => {
    const steps = [
        {
          id: '1',
          message: 'Welcome to our shoe store! How can I assist you today?',
          trigger: 'userQuery', // Updated trigger ID
        },
        {
          id: 'userQuery', // New step ID
          user: true,
          trigger: '3', // This trigger corresponds to an existing step
        },
        {
          id: '3',
          message: 'Thank you for your message! We will get back to you soon.',
          end: true,
        },
      ];

  return (
    <div className="help-container">
      <ChatBot steps={steps} />
    </div>
  );
};

export default Help;
