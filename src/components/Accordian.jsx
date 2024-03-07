import React, { useState } from "react";
import "../components/Styles/HeroGoGreen.css";

function Accordian() {
    const [activeQ, setActiveQ] = useState("q1");
  
    const openQ = (id) => {
      setActiveQ(activeQ === id ? "" : id);
    };
  
    const getClassAnswer = (id) => {
      return activeQ === id ? "active-answer" : ""; 
    };
  
    const getClassQuestion = (id) => {
      return activeQ === id ? "active-question" : "";
    };
  
    return (
      <>
        <section className="faq-section">
          <div className="container">
            <div className="faq-content">
              <div className="faq-content_title">
                <h5>FAQ</h5>
                <h2>Frequently Asked Questions</h2>
                <p>
                  Frequently Asked Questions About the GoGreen Initiative by Urbancartel:
                  Answers to Common Concerns and Inquiries.
                </p>
              </div>
  
              <div className="all-questions">
                <div className="faq-box">
                  <div
                    id="q1"
                    onClick={() => openQ("q1")}
                    className={`faq-box_question  ${getClassQuestion("q1")}`}
                  >
                    <p>1. What is special about the GoGreen initiative by Urbancartel?</p>
                    <i className="fa-solid fa-angle-down"></i>
                  </div>
                  <div
                    id="q1"
                    onClick={() => openQ("q1")}
                    className={`faq-box_answer ${getClassAnswer("q1")}`}
                  >
                    The GoGreen initiative by Urbancartel aims to promote environmental sustainability
                    by encouraging green practices such as recycling, reducing waste, and adopting eco-friendly
                    lifestyles. We believe in making a positive impact on the planet and inspiring others to 
                    join us in our mission towards a greener future.
                  </div>
                </div>
                <div className="faq-box">
                <div
                    id="q2"
                    onClick={() => openQ("q2")}
                    className={`faq-box_question ${getClassQuestion("q2")}`}
                    >
                    <p>2. How can I participate in the GoGreen initiative?</p>
                    <i className="fa-solid fa-angle-down"></i>
                    </div>
                <div
                    id="q2"
                    onClick={() => openQ("q2")}
                    className={`faq-box_answer ${getClassAnswer("q2")}`}
                    >
                        You can Participate by graciously sending us your gently used fashion products, such as shoes and clothing. Your thoughtful contributions will play a pivotal role in fostering sustainable fashion practices, as we endeavor to repurpose and upcycle 
                        these items to create beautiful and eco-friendly garments.we are deeply committed to using a portion of the proceeds to extend a helping hand to individuals and communities who may struggle to afford clothing, including precious children residing in orphanages.
                </div>
                </div>
                <div className="faq-box">
                  <div
                    id="q3"
                    onClick={() => openQ("q3")}
                    className={`faq-box_question ${getClassQuestion("q3")}`}
                  >
                    <p>3. What are some benefits of participating in the GoGreen initiative?</p>
                    <i className="fa-solid fa-angle-down"></i>
                  </div>
                  <div
                    id="q3"
                    onClick={() => openQ("q3")}
                    className={`faq-box_answer ${getClassAnswer("q3")}`}
                  >
                    Participating in the GoGreen initiative by Urbancartel offers numerous benefits,
                    including contributing to environmental conservation, reducing carbon footprint,
                    fostering a sense of community and collective responsibility, and promoting
                    sustainable living practices that benefit both present and future generations.
                    By joining the GoGreen movement, you become part of a global effort towards
                    building a healthier and more sustainable planet for all.
                  </div>
                  
                </div>
                <div className="faq-box">
                  <div
                    id="q4"
                    onClick={() => openQ("q4")}
                    className={`faq-box_question ${getClassQuestion("q4")}`}
                  >
                    <p>4. How does Urbancartel's GoGreen initiative contribute to environmental sustainability?</p>
                    <i className="fa-solid fa-angle-down"></i>
                  </div>
                  <div
                    id="q4"
                    onClick={() => openQ("q4")}
                    className={`faq-box_answer ${getClassAnswer("q4")}`}
                  >
                    Urbancartel's GoGreen initiative contributes to environmental sustainability
                    by raising awareness about eco-friendly practices, organizing community
                    clean-up events, partnering with environmental organizations, and promoting
                    the use of sustainable materials in our products and packaging. We are committed
                    to reducing our carbon footprint and promoting a greener lifestyle for our customers
                    and communities.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
}

export default Accordian;