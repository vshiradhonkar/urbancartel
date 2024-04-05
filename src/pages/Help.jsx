import React, { useState, useEffect, useRef } from 'react';
import BotpressChat from '../components/BotPress'; // Import the BotpressChat component
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import '../App.css';
import { SunspotLoader } from 'react-awesome-loaders-py3';

const Help = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Reference to the chat window
  const chatWindowRef = useRef(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

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
      <BotpressChat />
    </div>
  );
};

export default Help;