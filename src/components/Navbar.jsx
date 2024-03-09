import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../App.css";
import Logo from "../Fonts/Logo.png";
import { auth } from "../firebase";

function Navbar() {
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsUserSignedIn(!!user);

      if (user) {
        setUserName(user.displayName || 'User');
      } else {
        setUserName('');
      }
    });
    // Cleanup the subscription on component unmount
    return () => unsubscribe();
  }, []); // Empty dependency array ensures useEffect runs only once

  const handleSignOut = () => {
    document.body.classList.add('modal-open');
    setShowConfirmation(true);
  };

  const handleConfirmSignOut = async () => {
    try {
      await auth.signOut();
      alert("Signed out successfully. Thank You!");
      navigate("/");
    } catch (error) {
      console.error("Error signing out", error);
    } finally {
      document.body.classList.remove('modal-open');
      setShowConfirmation(false);
    }
  };

  return (
    <>
    <nav className='nav'>
    {isUserSignedIn ? (
    <div className='username'>
      {userName && <span>Hello, {userName}! </span>}
    </div>
  ):(
    <><Link to='/'>
        <img src={Logo} alt='navimg' />
      </Link></>
  )}
    <div className='nav_main'>
        <h4><Link to='/'>Home</Link></h4>
        <h4><Link to='/shop'>Shop</Link></h4>
        <h4><Link to='/cart'>Cart</Link></h4>
        <h4><Link to='/help'>Help</Link></h4>
        <h4><Link to='/terms'>Terms</Link></h4>
        <h4><Link to='/contact'>Contact</Link></h4>
      </div>
      <div className='nav_right'>
      {isUserSignedIn ? (
    <>
      <h4><Link onClick={() => window.scrollTo(0, 0)} to="/">Your Orders</Link></h4>
      <h4> 
        <Link onClick={handleSignOut}>Sign out</Link>
      </h4>
    </>
  ) : (
    <>
      <h4>
        <Link onClick={() => window.scrollTo(0, 0)} className="navbar_buttons_sign-in" to="/signin">
          Sign in
        </Link>
      </h4>
      <h4>
        <Link onClick={() => window.scrollTo(0, 0)} className="navbar_buttons_register" to="/register">
          Register
        </Link>
      </h4>
    </>
  )} 
      </div>
      {showConfirmation && (
                  <div className="confirmation-modal">
                    <p>Are you sure you want to sign out?</p>
                    <button onClick={handleConfirmSignOut}>Yes</button>
                    <button onClick={() => setShowConfirmation(false)}>No</button>
                  </div>
                )}
    </nav>
    </>
  );
}

export default Navbar;