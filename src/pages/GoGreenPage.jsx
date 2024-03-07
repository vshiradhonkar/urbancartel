import React, { useState, useEffect } from 'react';
import HeroGoGreen from '../components/HeroGoGreen';
import Upload from '../components/Upload';
import Accordian from '../components/Accordian';
import Footer from '../components/Footer';
import { SunspotLoader } from 'react-awesome-loaders-py3';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

function GoGreenPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    }, (error) => {
      setError(error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className='cart-loader'>
    <SunspotLoader
      gradientColors={["#fe330a", "#E0E7FF"]}
      shadowColor={"#9fa330"}
      desktopSize={"50px"}
      mobileSize={"40px"}
    />
  </div>;
  
  if (error) return <div>Error: {error.message}</div>;

  if (!user) {
    return (
      <>
        <div className='bg-grad-2'></div>
        <div className='signinplease'>Please sign in to proceed ahead.</div>
      </>
    );
  }

  return (
    <div>
      <HeroGoGreen />
      <Upload />
      <Accordian />
      <Footer />
    </div>
  );
}

export default GoGreenPage;