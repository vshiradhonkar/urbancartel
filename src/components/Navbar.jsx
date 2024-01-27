// eslint-disable-file
import React from 'react'
import "../App.css";


function Navbar() {
  return (
    <nav className='nav'>
    <img src='https://assets-global.website-files.com/64d3dd9edfb41666c35b15b7/64d3dd9edfb41666c35b15c2_Sundown%20logo.svg' alt='navimg' />
    <div className='nav_right'>
        <h4><a href='https://www.sundown-studio.com/work'>Home</a></h4>
        <h4><a href='https://www.sundown-studio.com/work'>Shop</a></h4>
        <h4><a href='https://www.sundown-studio.com/work'>Cart</a></h4>
    </div>
    </nav>
  )
}

export default Navbar;