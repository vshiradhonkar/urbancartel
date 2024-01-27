import React, {useEffect, useRef} from "react";
import "./App.css";
import Home from "./pages/Home";
import LocomotiveScroll from 'locomotive-scroll';


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
      <Home/>
    </div>
    </>
  );
}

export default App;
