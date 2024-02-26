import React, { useState } from 'react';
import { BsFillBagFill } from 'react-icons/bs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const Card = ({ img, title, star, reviews, prevPrice, newPrice }) => {
  const auth = firebase.auth(); // Get the Firebase Auth instance
  const user = auth.currentUser; // Get the current user

  const [showPopup, setShowPopup] = useState(false);

  const handleAddToCart = async () => {
    if (!user) {
      alert('Please sign in to add items to your cart.');
      return;
    }

    try {
      const cartRef = firebase.firestore().collection('carts').doc(user.uid);
      const cartSnapshot = await cartRef.get();

      if (cartSnapshot.exists) {
        const cartData = cartSnapshot.data();
        const products = cartData.products || [];

        // Check if the product already exists in the cart
        const existingProductIndex = products.findIndex(product => product.title === title);
        if (existingProductIndex !== -1) {
          // Product exists, update the quantity
          const updatedProducts = [...products];
          updatedProducts[existingProductIndex].quantity += 1;
          await cartRef.update({ products: updatedProducts });
        } else {
          // Product does not exist, add it to the cart
          await cartRef.set({
            products: [...products, { title, price: newPrice, quantity: 1 }]
          }, { merge: true });
        }
      } else {
        // Cart does not exist, create a new cart with the product
        await cartRef.set({
          products: [{ title, price: newPrice, quantity: 1 }]
        });
      }

      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  return (
    <>
      <section className="card">
        <img src={img} alt={title} className="card-img" />
        <div className="card-details">
          <h3 className="card-title">{title}</h3>
          <section className="card-reviews">
            {star} {star} {star} {star}
            <span className="total-reviews">{reviews}</span>
          </section>
          <section className="card-price">
            <div className="price">
              <del>{prevPrice}</del> {newPrice}
            </div>
            <div className="bag" onClick={handleAddToCart}>
              <BsFillBagFill className="bag-icon" />
            </div>
          </section>
        </div>
      </section>
      {showPopup && <div className="popup">Product added to cart!</div>}
    </>
  );
};

export default Card;