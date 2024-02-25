import React, {useEffect, useRef} from "react";
import { BrowserRouter , Routes , Route } from 'react-router-dom';
import "./App.css";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn"
import LocomotiveScroll from 'locomotive-scroll';
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Help from "./pages/Help";
import Shop from "./pages/Shop";


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
    <><div className="fixed-image"></div>
    <div ref={scrollContainerRef} className="App">
      <BrowserRouter>
      <Navbar/>
        <Routes>
          <Route path="/" element={<Home />}  />
          <Route path="/shop" element={<Shop />}  />
          <Route path="/signin" element={<SignIn />}  />
          <Route path="/register" element={<Register/>} />
          <Route path="/help" element={<Help/>} />
        </Routes>
      </BrowserRouter>

    </div>
    </>
  );
}

export default App;
