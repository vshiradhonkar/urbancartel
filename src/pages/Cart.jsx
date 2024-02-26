import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import '../App.css';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
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
      } else {
        // User is not authenticated, handle as needed
        setLoading(false);
        setCartItems([]);
      }
    });

    return () => unsubscribe(); // Unsubscribe from the authentication state listener
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="cart-container">
      <div className="cart-summary">
        <h2>{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</h2>
        <p>
          <a href="#">Keep shopping</a>
        </p>
        <p>
          Enjoy safe and secure shopping with our buyer protection program. Get a
          full refund if your items are lost, damaged, or don't arrive as
          described. <a href="#">See details</a>
        </p>
      </div>
      {cartItems.map((item, index) => (
        <div key={index} className="item-container">
          <img src={item.image} alt={item.title} />
          <div className="item-details">
            <h4>{item.title}</h4>
            <p>Price: {item.price} USD Each</p>
            <p>Quantity: {item.quantity}</p>
          </div>
        </div>
      ))}
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
          <span>Item(s) subtotal:</span> €49.04
        </p>
        <p>
          <span>Shipping:</span> €24.04
        </p>
        <p>
          <span>Tax:</span> €10.20
        </p>
        <p className="total">
          <span>Total (1 item):</span> €83.28
        </p>
        <a href="#" className="proceed-to-checkout">
          Proceed to checkout
        </a>
        <p>
          <a href="#">Apply coupon code</a>
        </p>
        <p>Local taxes included (where applicable)</p>
        <p>Additional duties and taxes may apply</p>
        <p>We offset carbon emissions from every delivery.</p>
      </div>
    </div>
  );
}

export default Cart;