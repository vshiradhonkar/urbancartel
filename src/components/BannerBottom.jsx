import React from 'react';
import "../App.css";

function BannerBottom() {
  return (
    <>
    <div className='bottom'>
        <h1>We are a group of design- <br/>
        driven, goal-focused creators,<br/>
        producers, and designers<br/>
        who believe that the details<br/>
        make all the difference.</h1>
        <div className='bottom-2'>
        <img src='https://assets-global.website-files.com/64d3dd9edfb41666c35b15b7/64d3dd9edfb41666c35b15d1_Holding_thumb-p-500.jpg' alt='' />
        <p>We love to create, we love to solve, we love to collaborate, and we love to turn amazing ideas into reality. We’re here to partner with you through every step of the process and know that relationships are the most important things we build.</p>
        </div>
    </div>
    <div className='bg-grad'>
    </div>
    <div className='feature-heading'>
    <p><div className='smalldot'></div> FEATURED PRODUCTS</p>
    </div>
    </>
  )
}

export default BannerBottom