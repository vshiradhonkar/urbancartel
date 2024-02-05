import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { firestore } from "../firebase";
import '../App.css';

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = async () => {
    try {
      if (email) {
        // Add the email to the 'subscriptions' collection in Firestore
        await firestore.collection("subscriptions").add({
          email,
          timestamp: new Date(),
        });

        // Clear the input field after successful subscription
        setEmail("");

        alert("Thank you for subscribing!");
      } else {
        alert("Please enter a valid email address.");
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      alert("An error occurred while subscribing. Please try again later.");
    }
  };

  return (
    <>
    
    <footer>
      <div className="container">
        <div className="footer-content">
          <ul className="footer-content_1">
            <li>
              <span>CAR</span> Rental
            </li>
            <li>We offer a wide range of vehicles for all your driving needs. We have the perfect car to meet your needs.
            </li>
            <li>
              <a href="tel:0123456789">
                <FontAwesomeIcon icon={faPhone} /> &nbsp; (0) -123-456-789
              </a>
            </li>

            <li>
              <a href="https://mail.google.com/mail/u/0/#inbox?compose=CllgCJTNqbwNXQMpXbQgKsfFPrCvbsdLxwCgmTQCWCqSGrwdNDWPLnvHKNcLfSlzCTncJfRnpwL">
                <FontAwesomeIcon icon={faEnvelope} /> &nbsp;
                carentalproject@gmail.com
              </a>
            </li>

            <li>
              <a
                style={{ fontSize: "14px" }}
                href="https://github.com/vshiradhonkar"
                rel="noreferrer"
                target="_blank"
              >
                Design by Winter
              </a>
            </li>
          </ul>

          <ul className="footer-content_2">
            <li>Company</li>
            <li>
              <a href="https://www.google.com/maps?sca_esv=581540659&sxsrf=AM9HkKkr1WFLXzsN_ZFDWPYgaODa-PqvPw:1699719139900&uact=5&gs_lp=Egxnd3Mtd2l6LXNlcnAiDCBMb3MgQW5nZWxlczIKEC4YigUYsQMYQzIIEAAYigUYkQIyDRAuGIoFGLEDGIMBGEMyCBAAGIoFGJECMg4QLhiKBRixAxiDARiRAjIIEAAYigUYkQIyCBAAGIoFGJECMg0QLhiKBRixAxiDARhDMgoQABiKBRixAxhDMgoQABiKBRixAxhDMhkQLhiKBRixAxhDGJcFGNwEGN4EGOAE2AEBSIEGUABYAHAAeAGQAQCYAbIBoAGyAaoBAzAuMbgBA8gBAPgBAvgBAeIDBBgAIEGIBgG6BgYIARABGBQ&q=Los+Angeles&um=1&ie=UTF-8&sa=X&ved=2ahUKEwiM4K-iq7yCAxW2klYBHVKgAYsQ_AUoA3oECAIQBQ">Los Santos</a>
            </li>
            <li>
              <Link to="/404">Careers</Link>
            </li>
            <li>
              <Link to="/404">Mobile</Link>
            </li>
            <li>
              <Link to="/404">Blog</Link>
            </li>
            <li>
              <Link to="/404">How we work</Link>
            </li>
          </ul>

          <ul className="footer-content_2">
            <li>Working Hours</li>
            <li>Mon - Fri: 9:00AM - 9:00PM</li>
            <li>Sat: 9:00AM - 4:00PM</li>
            <li>Sun: Closed</li>
          </ul>

          <ul className="footer-content_2">
            <li>Subscription</li>
            <li>
              <p>Be Informed, Be Inspired: Subscribe for a front-row seat to the latest News,
              Promotions, and Inspirations in the world of luxury travel.
              </p>
            </li>
            <li>
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </li>
            <br />
            <br />

            <li>
              <button className="submit-email" onClick={handleSubscribe} >Submit</button>
            </li>
          </ul>

        </div>
      </div>
    </footer>
  </>
    );
};

export default Footer;