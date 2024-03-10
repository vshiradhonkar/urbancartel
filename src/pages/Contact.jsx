import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPhone,
    faEnvelope,
    faEnvelopeOpenText,
    faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { firestore } from "../firebase";
import Modal from "react-modal";
import "../App.css";
import Footer from "../components/Footer";




function Contact() {
const [fullName, setFullName] = useState("");
const [email, setEmail] = useState("");
const [question, setQuestion] = useState("");
const [isModalOpen, setIsModalOpen] = useState(false);


const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate if required fields are filled
    if (!fullName || !email || !question) {
      // Handle validation error, e.g., show an alert
    alert("Please fill in all required fields");
    return;
    }

    try {
      // Store user's inquiry in Firestore
    await firestore.collection("contact-queries").add({
        fullName,
        email,
        question,
    });

      // Reset form fields after successful submission
    setFullName("");
    setEmail("");
    setQuestion("");

      // Display a success message or redirect the user
    setIsModalOpen(true);
    } catch (error) {
    console.error("Error sending message:", error);
    alert("An error occurred while sending the message. Please try again.");
      // Handle error, e.g., show an error message to the user
    }
};
const closeModal = () => {
    // Close the modal and reset the state
    setIsModalOpen(false);
};


return (
<>
    <section className="contact-page">

        <div className="container">
        <div className="contact-div">
            <div className="contact-div_text">
            <h2>Chatbot stumped? We've got your back.</h2>
            <p>
            Wow, our incredible chatbot couldn't manage to assist you? Shocking! Well, fear not, mere mortal, for we graciously invite you to contact us directly. It's not like that's what you wanted to do in the first place, right?
            </p>
            <p className="tag">
                <FontAwesomeIcon icon={faPhone} />
                &nbsp; (0) 123-456-6789
            </p>
            <p className="tag">
                <FontAwesomeIcon icon={faEnvelope} />
                &nbsp; urbancartelproject@gmail.com
            </p>
            <p className="tag">
                <FontAwesomeIcon icon={faLocationDot} />
                &nbsp; Los Santos
            </p>

            </div>

            

            <div className="contact-div_form">
            <form onSubmit={handleSubmit}>
                <label>
                Full Name <b>*</b>
                </label>
                <input type="text" placeholder='E.g: "Jack Smith"' value={fullName} onChange={(e) => setFullName(e.target.value)}/>

                <label>
                Email <b>*</b>
                </label>
                <input type="email" placeholder="youremail@example.com"  value={email} onChange={(e) => setEmail(e.target.value)} />

                <label>
                Tell us about it <b>*</b>
                </label>
                <input placeholder="Write Here.."  value={question}  onChange={(e) => setQuestion(e.target.value)}></input>
                <button type="submit">
                <FontAwesomeIcon icon={faEnvelopeOpenText} />
                &nbsp; Send Message
                </button>
            </form>
            </div>
          {/* Modal */}
    <Modal className="contact-modal"
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Query Recorded Modal">
        <h2>Greetings!</h2>
        <p>Your query has been recorded successfully.Thank you!</p>
        
        <button className="contact-modal-button" onClick={closeModal}>OK</button>
    
    </Modal>
    

        </div>
        </div>
        <div className="book-banner">
            <div className="book-banner_overlay"></div>
            <div className="container">
            <div className="text-content">
            <h2>
                Looks like our chatbot took a vacation! Need real assistance? We're here for you .</h2>
            <span>
                <FontAwesomeIcon icon={faPhone} />
                <h3>(0) 123-456-6789</h3>
            </span>
            </div>
        </div>
        </div>
        
       
      </section>
      <Footer/>
</>
  );
}

export default Contact;
