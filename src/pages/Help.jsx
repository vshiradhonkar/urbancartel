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
      // Check if the message is explicitly asking about shoes
      const isAskingAboutShoes = checkIfAskingAboutShoes(message);

      if (isAskingAboutShoes) {
        // If the user is asking about shoes, provide shoe recommendations
        const shoeRecommendations = getShoeRecommendations();
        addBotMessage(shoeRecommendations);
      } else {
        // If not asking about shoes, respond to simple greetings or continue with default response
        const isGreeting = checkIfGreeting(message);
        if (isGreeting) {
          const response = "Hello! How can I assist you today?";
          addBotMessage(response);
        } else {
          const response = "I'm sorry, the information is not relevant. Can you ask me about Urbancartel?";
          addBotMessage(response);
        }
      }
    } catch (error) {
      console.error('Error handling user message:', error);
    }
  };

  const checkIfAskingAboutShoes = (message) => {
    const askingAboutShoesKeywords = ['shoes', 'recommendations', 'sneakers', 'boots', 'footwear'];
    return askingAboutShoesKeywords.some(keyword => message.toLowerCase().includes(keyword));
  };

  const getShoeRecommendations = () => {
    const shoeData = data.map(shoe => `${shoe.title}: $${shoe.newPrice}`).join('\n');
    return `Here are some shoe recommendations available on Urbancartel:\n${shoeData}`;
  };

  const checkIfGreeting = (message) => {
    const greetings = ['hi', 'hello', 'hey', 'howdy', 'hi there'];
    return greetings.some(greeting => message.toLowerCase().includes(greeting));
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
          placeholder="Hi ! How can I help you today..."
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