import React, { useState, useEffect, useRef } from 'react';
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
  const [working, setWorking] = useState(false); // State to indicate if the chatbot is working

  // Reference to the chat window
  const chatWindowRef = useRef(null);

  // Initialize OpenAI with API key
  const openai = new OpenAI(process.env.REACT_APP_OPENAI_API_KEY);

  
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

  useEffect(() => {
    // Scroll chat window to the bottom if the user is already at the bottom
    if (chatWindowRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatWindowRef.current;
      if (scrollTop + clientHeight === scrollHeight) {
        chatWindowRef.current.scrollTop = scrollHeight;
      }
    }
  }, [messages]);

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
    setWorking(true);

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
        // Use OpenAI API to generate response for customer service feedback
        const customerServiceFeedback = await getCustomerServiceFeedback(message);
        addBotMessage(customerServiceFeedback);
      }
    } catch (error) {
      console.error('Error handling user message:', error);
    } finally {
      setWorking(false);
    }
  };

  const checkIfAskingAboutShoes = (message) => {
    const askingAboutShoesKeywords = ['shoes', 'recommendations', 'sneakers', 'boots', 'footwear', 'trainers', 'kicks', 'runners', 'sandals', 'flats', 'heels'];
    return askingAboutShoesKeywords.some(keyword => message.toLowerCase().includes(keyword));
  };

  const getShoeRecommendations = () => {
    const shoeData = data.map(shoe => `${shoe.title}: $${shoe.newPrice}`).join('\n');
    return `Here are some shoe recommendations available on Urbancartel:\n${shoeData}`;
  };

  const getCustomerServiceFeedback = async (message) => {
    // Use OpenAI API to generate response for customer service feedback
    const response = await openai.complete({
      engine: 'text-davinci-002',
      prompt: message,
      max_tokens: 150,
    });

    return response.data.choices[0].text.trim();
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
      <div className="chat-window" ref={chatWindowRef}>
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
      {working && <div className="working-indicator">Processing...</div>}
    </div>
  );
};

export default Help;