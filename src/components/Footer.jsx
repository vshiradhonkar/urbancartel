import React from 'react';
import '../App.css'; // Import your stylesheet for Footer styling

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>About Us</h3>
            <p>Your company description goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>Email: info@example.com</p>
            <p>Phone: (123) 456-7890</p>
          </div>
          <div className="footer-section">
            <h3>Follow Us</h3>
            <p>Connect with us on social media:</p>
            <div className="social-icons">
              {/* Add your social media icons here */}
              <a href="http://localhost:3000/signin" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href="http://localhost:3000/signin" target="_blank" rel="noopener noreferrer">Twitter</a>
              <a href="http://localhost:3000/signin" target="_blank" rel="noopener noreferrer">Instagram</a>
            </div>
          </div>
        </div>
        <div className="copyright">
          <p>&copy; 2022 Your Company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;