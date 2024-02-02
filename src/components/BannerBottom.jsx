import React from 'react';
import "../App.css";

function BannerBottom() {
  return (
    <>
    <div className='bottom'>
        <h1>Discover the Latest Shoe Trends <br/>
        with Our Fashion-Forward Collection</h1>
        <div className='bottom-2'>
        <img src='https://assets-global.website-files.com/64d3dd9edfb41666c35b15b7/64d3dd9edfb41666c35b15d1_Holding_thumb-p-500.jpg' alt='Shoe Collection' />
        <p>At our online store, we are passionate about creating stylish and comfortable shoes. Our design-driven team is dedicated to bringing you the latest trends and high-quality footwear. Whether you're into casual sneakers, elegant heels, or sporty kicks, we have something for everyone.</p>
        </div>
    </div>
    <div className='bg-grad'>
    </div>
    <div className='feature-heading'>
    <p><div className='smalldot'></div> EXPLORE OUR FEATURED SHOES</p>
    </div>
    </>
  )
}

export default BannerBottom;
