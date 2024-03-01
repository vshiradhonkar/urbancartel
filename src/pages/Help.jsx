import React, { useState, useEffect } from 'react';
import OpenAI from 'openai';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import '../App.css';
import { SunspotLoader } from 'react-awesome-loaders-py3';
import data from "../components/Shop-page/db/data";

const Help = () => {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize OpenAI with API key
  const apiKey = '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';
  const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        loadChatMessages(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadChatMessages = async (userId) => {
    try {
      const snapshot = await firebase.firestore().collection('userchat').doc(userId).get();
      if (snapshot.exists) {
        setMessages(snapshot.data().messages);
      }
    } catch (error) {
      console.error('Error loading chat messages:', error);
    }
  };

  const saveChatMessages = async (userId, messages) => {
    try {
      await firebase.firestore().collection('userchat').doc(userId).set({ messages });
    } catch (error) {
      console.error('Error saving chat messages:', error);
    }
  };

  const handleUserMessage = async (message) => {
    const newMessage = { id: messages.length + 1, user: true, text: message };
    setMessages([...messages, newMessage]);

    if (user) {
      await saveChatMessages(user.uid, [...messages, newMessage]);
    }

    try {
      // Filter data for relevant recommendations based on user message
      const filteredData = data?.filter(item => item.keywords?.some(keyword => message.toLowerCase().includes(keyword.toLowerCase())));

      // If there are filtered recommendations, display them to the user
      if (filteredData.length > 0) {
        const response = filteredData.map(item => `${item.title}: $${item.newPrice}`).join('\n');
        addBotMessage(response);
      } else {
        // If no relevant recommendations are found, send message to OpenAI for a response
        const completion = await openai.chat.completions.create({
          messages: [{ role: "system", content: message }],
          model: "gpt-3.5-turbo",
        });

        const botResponse = completion.choices[0].message.content;
        addBotMessage(botResponse);
      }
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
    }
  };

  const addBotMessage = (message) => {
    const newMessage = { id: messages.length + 1, user: false, text: message };
    setMessages([...messages, newMessage]);

    if (user) {
      saveChatMessages(user.uid, [...messages, newMessage]);
    }
  };

  if (loading) {
    return (
      <div className='cart-loader'>
        <SunspotLoader
          gradientColors={["#fe330a", "#E0E7FF"]}
          shadowColor={"#9fa330"}
          desktopSize={"50px"}
          mobileSize={"40px"}
        />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <div className='bg-grad-2'></div>
        <div className='signinplease'>Please sign in to proceed ahead.</div>
      </>
    );
  }

  return (
    <div className="help-container">
    <div className='bg-grad-3'></div>
    <div className='bg-grad-4'></div>
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