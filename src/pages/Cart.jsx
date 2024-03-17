import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus} from '@fortawesome/free-solid-svg-icons';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { firestore } from '../firebase';
import data from "../components/Shop-page/db/data";
import { SunspotLoader } from 'react-awesome-loaders-py3';
import '../App.css';
import { CardElement , useElements, useStripe } from '@stripe/react-stripe-js';
import CurrencyFormat from 'react-currency-format';
import axios from "../components/axios"
import { useNavigate } from 'react-router-dom';

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
  const stripe= useStripe();
  const elements = useElements();

  const [disabled, setDisabled] = useState(true);
  const [succeeded, setSucceeded] = useState(false); 
  const [processing, setProcessing] = useState(""); 
  const [clientSecret, setClientSecret] = useState(true);
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);

  const navigate = useNavigate();

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
    // Check if all required fields are filled
    const fieldsFilled =
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      phone.trim() !== "" &&
      age.trim() !== "" &&
      email.trim() !== "" &&
      address.trim() !== "" &&
      city.trim() !== "" &&
      zip.trim() !== "";
  
    // Update state based on whether all fields are filled
    setAllFieldsFilled(fieldsFilled);
  }, [firstName, lastName, phone, age, email, address, city, zip]);
  
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
  
    // Fetch client secret whenever cartItems change
    const getClientSecret = async () => {
      try {
        // Calculate the total amount in cents
        const totalAmount = subtotal * 100; // Assuming the amount is in cents
        const response = await axios.post(`/cart/create?total=${totalAmount}`);
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.error('Error fetching client secret:', error);
        // Handle error if needed
      }
    };
    
    getClientSecret();
  }, [cartItems]);
  console.log('the secret is >>>', clientSecret);

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
  if (totalItems === 0) {
    return (
      <>
        <div className='empty-cart-message'>
        <div className='bg-grad-3'></div>
          <h4 style={{ textAlign: 'center' }} className='signinplease'>Cart is empty, Start adding items to the cart to proceed.</h4>
          <div className='bg-grad-4'></div>
        </div>
      </>
    );
  }

  // stripe

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    
    try {
      // Confirm the payment and get the payload
      const payload = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)
        }
      });
      
      if (payload.error) {
        setError(`Payment failed: ${payload.error.message}`);
        setProcessing(false);
        return;
      }
      
      // Payment succeeded
      const currentUser = firebase.auth().currentUser;
      
      if (payload.paymentIntent.status === 'succeeded') {
        // Save order details to Firestore
        await firestore.collection('orders').add({
          userId: currentUser.uid,
          firstName,
          lastName,
          phone,
          age,
          email,
          address,
          city,
          zip,
          items: cartItems,
          total: total.toFixed(2),
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
      
        // Clear cart items
        await firestore.collection('carts').doc(currentUser.uid).set({ products: [] });
      
        // Clear input fields
        setFirstName("");
        setLastName("");
        setPhone("");
        setAge("");
        setEmail("");
        setAddress("");
        setCity("");
        setZip("");
      
        setSucceeded(true);
        setError(null);
        setProcessing(false);
      
        // Redirect to orders page
        navigate('/orders');
      
        // Show alert for successful payment
        alert("Payment successful!");
      } else {
        setError('Payment failed: Payment status is not succeeded.');
        setProcessing(false);
      }
    } catch (error) {
      setError(`Error placing order: ${error.message}`);
      setProcessing(false);
    }
  };
  const handleChange = event =>{
    //listen changes in CardElement
    // & display any errors as customer types their card details
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
}
  
  return (
  <>  
    <div className="cart-container">
      <div className="cart-summary">
        <h2>{totalItems} item in your cart</h2>
        <p>
          <a href="#/shop">Keep shopping</a>
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
              <p>Price: {item.price} INR Each</p>
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
          <span>Item(s) subtotal:</span> {subtotal.toFixed(2)} INR 
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
          <span>Shipping:</span> {shipping.toFixed(2)} INR 
        </p>
        <p>
          <span>Tax:</span> {tax.toFixed(2)} INR 
        </p>
        <p className="total">
          <span>Total ({totalItems} items):</span> {total.toFixed(2)} INR 
        </p>
        <h4>Payment</h4>
      <div className='card-payment'>
      <div class="flip-card">
      <div class="flip-card-inner">
      <div class="flip-card-front">
        <p class="heading_8264">MASTERCARD</p>
          <svg className="mastercard-logo" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="36" height="36" viewBox="0 0 48 48">
            <path fill="#ff9800" d="M32 10A14 14 0 1 0 32 38A14 14 0 1 0 32 10Z"></path>
            <path fill="#d50000" d="M16 10A14 14 0 1 0 16 38A14 14 0 1 0 16 10Z"></path>
            <path fill="#ff3d00" d="M18,24c0,4.755,2.376,8.95,6,11.48c3.624-2.53,6-6.725,6-11.48s-2.376-8.95-6-11.48 C20.376,15.05,18,19.245,18,24z"></path>
          </svg>
          <svg className="cards-sim" width={40} height={40} viewBox="0 0 1024 1024" style={{ position: 'absolute', top: '2em', left: '2em' }} version="1.1" xmlns="http://www.w3.org/2000/svg">
            <path d="M106.666667 746.666667V277.333333c0-46.933333 38.4-85.333333 85.333333-85.333333h640c46.933333 0 85.333333 38.4 85.333333 85.333333v469.333334c0 46.933333-38.4 85.333333-85.333333 85.333333H192c-46.933333 0-85.333333-38.4-85.333333-85.333333z" fill="#FF9800" />
            <path d="M917.333333 448v-42.666667H661.333333c-23.466667 0-42.666667-19.2-42.666666-42.666666s19.2-42.666667 42.666666-42.666667h21.333334v-42.666667h-21.333334c-46.933333 0-85.333333 38.4-85.333333 85.333334s38.4 85.333333 85.333333 85.333333h64v128h-64c-59.733333 0-106.666667 46.933333-106.666666 106.666667s46.933333 106.666667 106.666666 106.666666h42.666667v-42.666666h-42.666667c-36.266667 0-64-27.733333-64-64s27.733333-64 64-64h256v-42.666667h-149.333333v-128h149.333333zM362.666667 576h-64v-128h64c46.933333 0 85.333333-38.4 85.333333-85.333333s-38.4-85.333333-85.333333-85.333334h-64v42.666667h64c23.466667 0 42.666667 19.2 42.666666 42.666667s-19.2 42.666667-42.666666 42.666667H106.666667v42.666667h149.333333v128H106.666667v42.666667h256c36.266667 0 64 27.733333 64 64s-27.733333 64-64 64h-42.666667v42.666666h42.666667c59.733333 0 106.666667-46.933333 106.666666-106.666666s-46.933333-106.666667-106.666666-106.666667z" fill="#FFD54F" />
          </svg>
        <p class="number">4242 4242 4242 4242</p>
        <p class="valid_thru">VALID THRU</p>
        <p class="date_8264">4 2 / 4 2</p>
        <p class="name">BRUCE WAYNE</p>
      </div>  
        <div class="flip-card-back">
            <div class="strip"></div>
            <div class="mstrip"></div>
            <div class="sstrip">
              <p class="code">***</p>
            </div>
        </div>
    </div>
      </div>
      <div class="form-container">
      <form onSubmit={handleSubmit}> 
                    <CardElement onChange={handleChange}/>

                    <div className='payment_priceContainer'>
                    <CurrencyFormat
                      renderText={(value)=>(
                      <h3>Order Total: {value}</h3>
                      )}
                      decimalScale={2}
                      value={total}
                      displayType={"text"}
                      thousandSeparator={true}
                      suffix={" INR"}
                  />
                  {!allFieldsFilled && <p className="error">All fields are required.</p>}
                    <button className="proceed-to-checkout" disabled={processing || disabled || !allFieldsFilled || succeeded}>
                        <span>{processing ? <p>Processing</p> : "Pay"} </span>
                        <svg class="svgIcon" viewBox="0 0 576 512">
                            <path d="M512 80c8.8 0 16 7.2 16 16v32H48V96c0-8.8 7.2-16 16-16H512zm16 144V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V224H528zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm56 304c-13.3 0-24 10.7-24 24s10.7 24 24 24h48c13.3 0 24-10.7 24-24s-10.7-24-24-24H120zm128 0c-13.3 0-24 10.7-24 24s10.7 24 24 24H360c13.3 0 24-10.7 24-24s-10.7-24-24-24H248z"></path>
                        </svg>
                    </button>
                    
                    
                    </div>

                    {/* Errors */}
                    {error && <div>{error}</div>}
            </form>
            </div>
      </div>

        {/* <button  className="proceed-to-checkout">
        Pay
        <svg class="svgIcon" viewBox="0 0 576 512"><path 
        d="M512 80c8.8 0 16 7.2 16 16v32H48V96c0-8.8 7.2-16 16-16H512zm16 144V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V224H528zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm56 304c-13.3 0-24 10.7-24 24s10.7 24 24 24h48c13.3 0 24-10.7 24-24s-10.7-24-24-24H120zm128 0c-13.3 0-24 10.7-24 24s10.7 24 24 24H360c13.3 0 24-10.7 24-24s-10.7-24-24-24H248z"></path></svg>
        </button> */}
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