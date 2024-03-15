import React, { useEffect, useRef } from "react";
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import LocomotiveScroll from 'locomotive-scroll';
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Help from "./pages/Help";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import GoGreenPage from "./pages/GoGreenPage";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import Orders from "./pages/Orders";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";


const promise = loadStripe("pk_test_51NxS4wSAFfI6nMC5jVRHjbmp8P8qsJDkgm7j4I73OYnR9iurQSclSaS1a7MK6HSeNInhqJsnu7vBBtroq9RpZ7yD00g6GGmn3Q");

function App() {
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const scroll = new LocomotiveScroll({
      el: scrollContainerRef.current,
      smooth: true,
      // Add other options as needed
    });

    return () => {
      // Clean up Locomotive Scroll when the component is unmounted
      scroll.destroy();
    };
  }, []);

  return (
    <>
      <div className="fixed-image"></div>
      <div ref={scrollContainerRef} className="App">
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/success" element={<Success />} />
            <Route path="/cancel" element={<Cancel />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="/help" element={<Help />} />
            <Route path="/gogreen" element={<GoGreenPage />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/contact" element={<GoGreenPage />} />
            <Route path="/cart" element={<Elements stripe={promise}><Cart/></Elements>} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
