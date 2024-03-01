import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from 'react-router-dom';
import { auth, firestore, signInWithGoogle } from "../firebase";
import "../App.css";
import Footer from "../components/Footer";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    phoneNumber: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newUserCredential = await auth.createUserWithEmailAndPassword(
        formData.email,
        formData.password
      );

      const newUser = newUserCredential.user;

      await firestore.collection("users").doc(newUser.uid).set({
        firstName: formData.name,
        lastName: formData.surname,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
      });

      alert("Registration successful");
      console.log("Registration successful");
      setFormData({
        name: "",
        surname: "",
        phoneNumber: "",
        email: "",
        password: "",
      });
       // Redirect to the home route
      navigate('/');
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("The email address is already in use by another account. Please sign in instead.");
        // You can also redirect the user to the sign-in page or provide a link to it
      } else {
        alert("An error occurred. Please try again later.");
        console.error("Error registering user", error);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();

      if (result.success) {
        navigate('/');
        alert("Sign-in successful. Thank You!");
      } else {
        console.error("Error during Google Sign-In:", result.error);
        alert("Error signing in with Google. Please try again.");
      }
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
    }
  };

  return (
    <div>
      <section className="register-page ">
        <div className="container-register">
          <h1 className="text">Sign Up</h1>
          <div className="signUpGoogle">
            <Link className="signUpGoogle" onClick={handleGoogleSignIn}>
              Sign up with Google <pre> </pre>
              <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 488 512">
                <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
              </svg>
            </Link>
          </div>
          <h2 className="signup-head">or Sign Up with your email</h2>
          <div className="name">
            <div className="input-group">
              <h3>First Name</h3>
              <input
                type="text"
                name="name"
                value={formData.name}
                placeholder="Enter Your First Name"
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <h3>Last Name</h3>
              <input
                type="text"
                name="surname"
                value={formData.surname}
                placeholder="Enter Your Last Name"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="input-group">
            <h3>Phone Number</h3>
            <input
              type="number"
              name="phoneNumber"
              value={formData.phoneNumber}
              placeholder="Enter Your Phone Number"
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <h3>Email</h3>
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="Enter Your Email Address"
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <h3>Password</h3>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                placeholder="Enter Your Password"
                onChange={handleChange}
              />
              <button onClick={togglePasswordVisibility} type="button">
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>
          <div className="input-group">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              By Signing up I agree with <Link to="/conditions" onClick={() => window.scrollTo(0, 0)}>Terms & Conditions</Link>
            </label>
          </div>
          <div className="signUp">
            <button className="signUpButton" onClick={handleSubmit}>
              Sign up
            </button>
          </div>
          <h3 className="already">
            Already have an Account? &nbsp;
            <Link to="/sign-in" onClick={() => window.scrollTo(0, 0)}>
              Sign In
            </Link>
          </h3>
        </div>
      </section>
      
      <Footer/>
    </div>
  );
}

export default Register;