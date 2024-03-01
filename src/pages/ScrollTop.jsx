import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
const ScrollTop = () => {
    const [goUp, setGoUp] = useState("false");

  const scrollTop = () => {
    window.scroll({ top: (0, 0), behavior: "smooth" });
  };

 

  useEffect(() => {
    const onPageScroll = () => {
      if (window.pageYOffset > 600) {
        setGoUp(true);
      } else {
        setGoUp(false);
      }
    };
    window.addEventListener("scroll", onPageScroll);
    return () => {
      window.removeEventListener("scroll", onPageScroll);
    };
  }, []);
    return (
        <div>
            <div onClick={scrollTop} className={`scroll-up ${goUp ? "show-scroll" : ""}`}>
        <FontAwesomeIcon icon={faAngleUp} />
        </div>
        </div>
    );
}

export default ScrollTop;
