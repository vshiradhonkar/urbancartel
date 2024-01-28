import React, { useState } from 'react';
import "../App.css";
import productData from './ProductData.jsx';

function FeaturedProducts() {
  const [isFixedImageVisible, setIsFixedImageVisible] = useState(false);
  const [fixedImageSrc, setFixedImageSrc] = useState('');

  const handleContainerEnter = () => {
    setIsFixedImageVisible(true);
  }

  const handleContainerLeave = () => {
    setIsFixedImageVisible(false);
  }

  const handleElemEnter = (image) => {
    setFixedImageSrc(image);
  }

  return (
    <>
      <div
        id="fixed-image"
        className="fixed-image"
        style={{ backgroundImage: `url(${fixedImageSrc})`, display: isFixedImageVisible ? 'block' : 'none' }}
      ></div>
      <div className='featured-products'>
        <div
          id="elem-container"
          className='elem-container'
          onMouseEnter={handleContainerEnter}
          onMouseLeave={handleContainerLeave}
        >
          {productData.map((item, index) => (
            <div
              key={index}
              className='elem'
              data-image={item.image}
              onMouseEnter={() => handleElemEnter(item.image)}
            >
              <div className='overlay'></div>
              <h2>{item.title}</h2>
            </div>
          ))}
        </div>
      </div>
      <div className='nav_right'>
      <h4><a href='https://www.sundown-studio.com/work'>All Projects  →</a></h4>
      </div>
    </>
  );
}

export default FeaturedProducts;