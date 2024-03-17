import React, { useState, useEffect, useRef } from 'react';
import { SunspotLoader } from 'react-awesome-loaders-py3';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import '../App.css';

const Help = () => {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false); 

  const chatWindowRef = useRef(null);

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

  const handleUserMessage = async (message) => {
    // Your message handling logic here
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