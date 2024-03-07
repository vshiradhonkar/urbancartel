import React from 'react';
import "../components/Styles/HeroGoGreen.css";
import Logo from "../Fonts/Logo.svg";

function HeroGoGreen() {
  return (<>
    <div className='herogogreencontainer'>
      <div className="herogogreencard">
        <div className="herogogreenborder"></div>
        <div ><img className='herogogreenimage' src={Logo} alt=''/></div>
        <div className="content">
          <div className="logo">
            <div className="logo1">
              <h1>GoGreen→ Leading the Fashion Revolution</h1>
            </div>
          </div>
          <span className="logo-bottom-text">
          Lets make a difference
          </span>
        </div>
        <div><button class="ui-btn"><span>Explore!</span></button></div>
        <span className="bottom-text">An Urbancartel Initiative</span>
      </div>
          </div>
    <div className='poorpeople'></div>

    </>
  );
}

export default HeroGoGreen;