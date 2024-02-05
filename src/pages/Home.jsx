import React from 'react';
import "../App.css";
import Hero from '../components/Hero';
import HeroShape from '../components/HeroShape';
import Banner from "../components/Banner.jsx";
import BannerBottom from '../components/BannerBottom.jsx';
import FeaturedProducts from '../components/FeaturedProducts.jsx';
import Panel from '../components/Panel.jsx';
import Footer from '../components/Footer.jsx';



function Home() {
  return (
    <>
      <div className='HomePage'>
        
        <Hero/>
        <HeroShape/>
        {/* <video autoPlay loop muted src='https://download-video.akamaized.net/v3-1/playback/bdb3a683-9706-4177-8ca4-48dfe2703fac/c72af10b?__token__=st=1706273097~exp=1706287497~acl=%2Fv3-1%2Fplayback%2Fbdb3a683-9706-4177-8ca4-48dfe2703fac%2Fc72af10b%2A~hmac=f1ad6b279854988debc84780282aa90ad89ff0cf1040e1ce483d2047bb131d85&r=dXMtd2VzdDE%3D'></video> */}
        <Banner/>
        <BannerBottom/>
        <FeaturedProducts/>
        <Panel/>
        <Footer/>
    </div>
    
    </>
  )
}

export default Home;