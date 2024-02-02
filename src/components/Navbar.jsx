// eslint-disable-file
import React from 'react';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import "../App.css";
import Logo from "../Fonts/Logo.png";
function Navbar() {
  return (
    <nav className='nav'>
      <Link to='/'>
        <img src={Logo} alt='navimg' />
      </Link>
      <div className='nav_right'>
      
        <h4><Link to='/'>Home</Link></h4>
        <h4><Link to='/'>Shop</Link></h4>
        <h4><Link to='/'>Cart</Link></h4>
        <h4><Link to='/signin'>Login</Link></h4>
      </div>
    </nav>
  );
}

export default Navbar;
