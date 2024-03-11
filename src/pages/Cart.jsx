import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus} from '@fortawesome/free-solid-svg-icons';
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");

  const handleFirstName = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastName = (e) => {
    setLastName(e.target.value);
  };

  const handlePhone = (e) => {
    setPhone(e.target.value);
  };

  const handleAge = (e) => {
    setAge(e.target.value);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleAddress = (e) => {
    setAddress(e.target.value);
  };

  const handleCity = (e) => {
    setCity(e.target.value);
  };

  const handleZip = (e) => {
    setZip(e.target.value);
  };

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
  <>
    <div className="cart-container">
      <div className="cart-summary">
        <h2>{totalItems} item in your cart</h2>
        <p>
          <a href="#/">Keep shopping</a>
        </p>
        <br/>
        <p>
          Enjoy safe and secure shopping with our buyer protection program. Get a
          full refund if your items are lost, damaged, or don't arrive . <a href="#/terms"> See details</a>
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
                <svg viewBox="0 0 448 512" class="svgIcon"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg>
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
    {/* Personal Details */}
    <div className='personal-info'>          <h4>Personal Information</h4>
          <form className="info-form">
            <div className="info-form_2col">
              <span>
                <label>
                  First Name <b>*</b>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={handleFirstName}
                  placeholder="Enter Your First Name"
                  required
                />
                <p className="error">This is Required Field.</p>
              </span>

              <span>
                <label>
                  Last Name <b>*</b>
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={handleLastName}
                  placeholder="Enter Your Last Name"
                  required
                />
                <p className="error">This is Required Field.</p>
              </span>

              <span>
                <label>
                  Phone Number <b>*</b>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhone}
                  placeholder="Enter Your Phone Number"
                  required
                />
                <p className="error">This is Required Field.</p>
              </span>

              <span>
                <label>
                  Age <b>*</b>
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={handleAge}
                  placeholder="18"
                  min="18"
                  max="75"
                  required
                />
                <p className="error">This is Required Field.</p>
              </span>
            </div>

            <div className="info-form_1col">
              <span>
                <label>
                  Email <b>*</b>
                </label>
                <input
                value={email}
                  type="email"
                  onChange={handleEmail}
                  placeholder="Enter your Email Address"
                  required
                />
                <p className="error">This is Required Field.</p>
              </span>

              <span>
                <label>
                  Address <b>*</b>
                </label>
                <input
                  value={address}
                  type="text"
                  onChange={handleAddress}
                  placeholder="Enter your Street Address"
                  required
                />
                <p className="error">This is Required Field.</p>
              </span>

              <span>
                <label>
                  City <b>*</b>
                </label>
                <input
                value={city}
                  type="text"
                  onChange={handleCity}
                  placeholder="Enter your City"
                  required
                />
                <p className="error">This is Required Field.</p>
              </span>

              <span>
                <label>
                  Zip Code <b>*</b>
                </label>
                <input
                  type="text"
                  onChange={handleZip}
                  value={zip}
                  placeholder="Enter your Zip Code"
                  required
                />
                <p className="error">This is Required Field.</p>
              </span>
            </div>
            <span className="info-form_checkbox">
              <input type="checkbox" required/>
              <p  className='terms-and-conditions'>I agree to all Terms & Conditions</p>
            </span>
            <p className="error-para">After completing the payment process, you'll receive an email with your order details,
            including product information, delivery address, scheduled delivery time, and payment instructions. 
            Please ensure payment is made to confirm your order. For any inquiries or assistance, our dedicated customer 
            support team at UrbanCartel is available via email at urbancartelproject@gmail.com or by phone at (0) 123-456-6789.
            We're here to ensure a seamless shopping experience. Safe Shopping!</p>
          </form>

        <p>
          <span>Shipping:</span> {shipping.toFixed(2)} USD 
        </p>
        <p>
          <span>Tax:</span> {tax.toFixed(2)} USD 
        </p>
        <p className="total">
          <span>Total ({totalItems} items):</span> {total.toFixed(2)} USD 
        </p>
      
        <button  className="proceed-to-checkout">
        Pay
        <svg class="svgIcon" viewBox="0 0 576 512"><path 
        d="M512 80c8.8 0 16 7.2 16 16v32H48V96c0-8.8 7.2-16 16-16H512zm16 144V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V224H528zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm56 304c-13.3 0-24 10.7-24 24s10.7 24 24 24h48c13.3 0 24-10.7 24-24s-10.7-24-24-24H120zm128 0c-13.3 0-24 10.7-24 24s10.7 24 24 24H360c13.3 0 24-10.7 24-24s-10.7-24-24-24H248z"></path></svg>
        </button>
        <p>Local taxes included (where applicable)</p>
        <p>Additional duties and taxes may apply</p>
        <p>We offset carbon emissions from every delivery.</p>
      </div>
    </div>
  </div>
  </>
  );
}

export default Cart;