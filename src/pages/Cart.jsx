import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faTrash } from '@fortawesome/free-solid-svg-icons';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import data from "../components/Shop-page/db/data";
import { SunspotLoader } from 'react-awesome-loaders-py3';
import '../App.css';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [tax, setTax] = useState(0);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        fetchCartItems(user);
      } else {
        setLoading(false);
        setCartItems([]);
      }
    });

    return () => unsubscribe(); // Unsubscribe from the authentication state listener
  }, []);

  useEffect(() => {
    // Calculate subtotal
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setSubtotal(subtotal);

    // Calculate shipping (2% of subtotal)
    const shipping = subtotal * 0.02;
    setShipping(shipping);

    // Calculate tax (6% of subtotal)
    const tax = subtotal * 0.06;
    setTax(tax);
  }, [cartItems]);

  const fetchCartItems = async (user) => {
    try {
      const cartRef = firebase.firestore().collection('carts').doc(user.uid);
      const cartDoc = await cartRef.get();
      if (cartDoc.exists) {
        const items = cartDoc.data().products || [];
        setCartItems(items);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const findProductById = (productId) => {
    return data.find((product) => product.title === productId);
  };

  const handleIncrementQuantity = async (index) => {
    try {
      const updatedCartItems = [...cartItems];
      updatedCartItems[index].quantity += 1;
      setCartItems(updatedCartItems);
      await updateCartItemQuantity(updatedCartItems[index].title, updatedCartItems[index].quantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };
  
  const handleDecrementQuantity = async (index) => {
    try {
      const updatedCartItems = [...cartItems];
      if (updatedCartItems[index].quantity > 1) {
        updatedCartItems[index].quantity -= 1;
        setCartItems(updatedCartItems);
        await updateCartItemQuantity(updatedCartItems[index].title, updatedCartItems[index].quantity);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };
  
  const handleRemoveFromCart = async (index) => {
    try {
      const updatedCartItems = [...cartItems];
      const removedProduct = updatedCartItems.splice(index, 1)[0]; // Remove the product from the cartItems array
      setCartItems(updatedCartItems);
  
      const cartRef = firebase.firestore().collection('carts').doc(user.uid);
      const cartDoc = await cartRef.get();
  
      if (cartDoc.exists) {
        const cartData = cartDoc.data();
        const updatedProducts = cartData.products.filter(product => product.title !== removedProduct.title); // Filter out the removed product
        await cartRef.update({ products: updatedProducts });
      }
    } catch (error) {
      console.error('Error removing product from cart:', error);
    }
  };

  const updateCartItemQuantity = async (productId, quantity) => {
    try {
      const cartRef = firebase.firestore().collection('carts').doc(user.uid);
      const cartDoc = await cartRef.get();

      if (cartDoc.exists) {
        const cartData = cartDoc.data();
        const updatedProducts = cartData.products.map(product => {
          if (product.title === productId) {
            return { ...product, quantity };
          }
          return product;
        });
        await cartRef.update({ products: updatedProducts });
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  if (loading) return <div className='cart-loader'>
    <SunspotLoader
                gradientColors={["#fe330a", "#E0E7FF"]}
                shadowColor={"#9fa330"}
                desktopSize={"50px"}
                mobileSize={"40px"}
        />
    </div>;
  if (error) return <div>Error: {error}</div>;

  if (!user) {
    return (
      <>
        <div className='bg-grad-2'></div>
        <div className='signinplease'>Please sign in to view your cart.</div>
      </>
    );
  }

  // Calculate total amount
  const total = subtotal + shipping + tax;

  // Calculate total number of items
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="cart-container">
      <div className="cart-summary">
        <h2>{totalItems} item in your cart</h2>
        <p>
          <a href="#/">Keep shopping</a>
        </p>
        <p>
          Enjoy safe and secure shopping with our buyer protection program. Get a
          full refund if your items are lost, damaged, or don't arrive as
          described. <a href="#/">See details</a>
        </p>
      </div>
      {cartItems.map((item, index) => {
        const product = findProductById(item.title);
        if (!product) return null; // Product not found in data.js
        return (
          <div key={index} className="item-container">
            <img src={product.img} alt={product.title} />
            <div className="item-details">
              <div className="title-container">
                <h4>{product.title}<button className="remove-button" onClick={() => handleRemoveFromCart(index)}>
                  <FontAwesomeIcon icon={faTrash} /> Remove From Cart
                </button></h4>
                
              </div>
              <p>Price: {item.price} USD Each</p>
              <div className="quantity-controls">
                <button className="quantity-button" onClick={() => handleDecrementQuantity(index)}>
                  <FontAwesomeIcon icon={faMinus} />
                </button>
                <span>{item.quantity}</span>
                <button className="quantity-button" onClick={() => handleIncrementQuantity(index)}>
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
      <div className="gift-options">
        <label htmlFor="gift-checkbox">
          <input type="checkbox" id="gift-checkbox" /> This order is a gift
        </label>
        <p>
          Prices will not be shown on the packing slip.
        </p>
        <input type="text" placeholder="Add a note to seller (optional)" />
      </div>
      <div className="order-summary">
        <p>
          <span>Item(s) subtotal:</span> {subtotal.toFixed(2)} USD 
        </p>
        <p>
          <span>Shipping:</span> {shipping.toFixed(2)} USD 
        </p>
        <p>
          <span>Tax:</span> {tax.toFixed(2)} USD 
        </p>
        <p className="total">
          <span>Total ({totalItems} items):</span> {total.toFixed(2)} USD 
        </p>
      
        <a href="#/" className="proceed-to-checkout">
          Proceed to checkout
        </a>
        <p>
          <a href="#/">Apply coupon code</a>
        </p>
        <p>Local taxes included (where applicable)</p>
        <p>Additional duties and taxes may apply</p>
        <p>We offset carbon emissions from every delivery.</p>
      </div>
    </div>
  );
}

export default Cart;