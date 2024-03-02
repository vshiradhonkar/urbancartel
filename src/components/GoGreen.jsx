import React from 'react';
import "../components/Styles/GoGreen.css";
import { Link } from 'react-router-dom';

function GoGreen() {
return (
    <div className='green-component'>
    <div className='green-card'>
    <div className="parent">
        <div className="card">
            <div className="logo">
                <span className="circle circle1"></span>
                <span className="circle circle2"></span>
                <span className="circle circle3"></span>
                <span className="circle circle4"></span>
                <span className="circle circle5"></span>
            </div>
            <div className="glass"></div>
            <div className="content">
                <span className="title"> URBANCARTEL GREEN</span>
                <span className="text">Transforming fashion, empowering communities through sustainability</span>
            </div>
        </div>
        
    </div>
    </div>
    <p className='green-para'>Press the button below to proceed</p>
    <div className='green'>
        <button className='go-green'><Link onClick={() => window.scrollTo(0, 0)} to="/">Go Green  →</Link></button>
    </div></div>
)
}

export default GoGreen