import "../App.css";
import React, { useEffect, useState } from "react";
import { FaSignInAlt } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { auth } from "../firebase";
import { useNavigate,Link} from 'react-router-dom';
import {signInWithGoogle} from "../firebase";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isAlertOpen, setIsAlertOpen] = useState(false); // State for alert
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      console.log("Attempting sign-in...");
      await auth.signInWithEmailAndPassword(formData.email, formData.password);
      setFormData({
        email: "",
        password: "",
      });

      console.log("Sign-in successful");
      
      setIsAlertOpen(true); // Open the alert for successful sign-in
      navigate('/');
    } catch (error) {
      console.error("Error signing in", error);

      // Check the error code to display appropriate alerts
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        alert("Invalid email or password. Please try again.");
      } else {
        alert("Error signing in. Please try again later.");
      }
    }
  };

  const closeAlert = () => {
    setIsAlertOpen(false);
    navigate('/'); // Navigate to the '/' route
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // The user argument will be non-null if a user is signed in
    });

    return () => unsubscribe();
  }, [navigate]);
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
       // Check if the sign-in was successful
      if (result.success) {
        // After successful Google Sign-In, redirect to the home page
        navigate('/');
        alert("Sign-in successful. Thank You!");
      } else {
        // If there's an issue with sign-in, show an alert
        console.error("Error during Google Sign-In:", result.error);
        alert("Error signing in with Google. Please try again.");
      }
  
    } catch (error) {
      // If there's an error during Google Sign-In, show an alert
      
      console.error("Error during Google Sign-In:", error);
    }
  };


  return (
    <>
      <div className="ui-panel">
        <div className="background-image"></div>
        <div className="login-form">
          <h1 className="h1s">Sign In</h1>
          <input
            className="login-input"
            name="email"
            type="text"
            placeholder="Enter your Email"
            value={formData.email}
            onChange={handleChange}
          />
          <br />
          <input
            className="login-input"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your Password"
            value={formData.password}
            onChange={handleChange}
          />
          <button className="loginpasseye" onClick={togglePasswordVisibility} type="button">
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
          <br />
          <div className="buttons">
            <button type="submit" onClick={handleSignIn} className="Btn">
              <div className="sign">
                <FaSignInAlt className="icon fa-xl" style={{ color: "#ffffff" }} />
              </div>
              <div className="texts">Login</div>
            </button>
          </div>
          <div className="signUpGoogle">
            <Link to="#" className="signUpGoogle" onClick={handleGoogleSignIn}>
              Sign in with Google <pre> </pre>
              <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 488 512">
              <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
              </svg>
            </Link>
          </div>
          <br />
        </div>
        <a href="#/register" onClick={() => window.scrollTo(0, 0)} className="text1">
          Don't have an account?
        </a>
        <br />
      </div>

      {isAlertOpen && (
        <div className="alert">
          <h2>Greetings!</h2>
          <p>You are signed in successfully. Thank you!</p>
          <button className="alert-button" onClick={closeAlert}>
            OK
          </button>
        </div>
      )}
    </>
  );
}

export default SignIn;