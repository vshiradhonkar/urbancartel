import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../App.css";
import data from "../components/Shop-page/db/data";

function FeaturedProducts() {
  const [isFixedImageVisible, setIsFixedImageVisible] = useState(false);
  const [fixedImageSrc, setFixedImageSrc] = useState('');
  const [randomProducts, setRandomProducts] = useState([]);

  useEffect(() => {
    // Shuffle the data array
    const shuffledData = shuffleArray(data);
    // Slice the first 7 items
    const randomProducts = shuffledData.slice(0, 7);
    setRandomProducts(randomProducts);
  }, []);

  const handleContainerEnter = () => {
    setIsFixedImageVisible(true);
  }

  const handleContainerLeave = () => {
    setIsFixedImageVisible(false);
  }

  const handleElemEnter = (image) => {
    setFixedImageSrc(image);
  }

  // Function to shuffle an array (Fisher-Yates shuffle algorithm)
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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
          {randomProducts.map((item, index) => (
            <div
              key={index}
              className='elem'
              data-image={item.img}
              onMouseEnter={() => handleElemEnter(item.img)}
            >
              <div className='overlay'></div>
              <h2>{item.title}</h2>
            </div>
          ))}
        </div>
      </div>
      <div className='product-button'>
      <h4><Link to='/shop'>All Products  →</Link></h4>
      </div>
    </>
  );
}

export default FeaturedProducts;