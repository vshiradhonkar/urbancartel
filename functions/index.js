const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")('sk_test_51NxS4wSAFfI6nMC5orPAvbi8DDYEEp3nW75tvscU02NDdRKAPrVJcmWatTa9in59MYzxcCUDIdRL9jUASsd5lKdz00ojdbF7nj');

// Initialize the Express app
const app = express();

// Enable CORS
app.use(cors({origin: true}));
app.use(express.json());

app.get("/", (request, response) =>
  response.status(200).send("hello world"),
);

// Define your API routes
app.post("/cart/create", async (request, response) => {
  const total = request.query.total;

  console.log("Payment request received, for this amount: ", total);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "INR",
    });

    console.log("Payment successful! Amount:", total);

    response.status(201).send({clientSecret: paymentIntent.client_secret});
  } catch (error) {
    console.error("Error creating payment intent:", error);
    response.status(500).send(
        {error: "An error occurred while creating payment intent"});
  }
});


// Export the Express app as a Cloud Function
exports.api = functions.https.onRequest(app);


// imports
// api
// app config
// middlewares
// api routes
// listen command
// example endpoint
// http://127.0.0.1:5001/urbancartel-2024/us-central1/api