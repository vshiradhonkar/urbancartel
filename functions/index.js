const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(`sk_test_51NxS4wSAFfI6nMC5orPAvbi8DDYEEp3nW75tv
scU02NDdRKAPr
VJcm
WatT
a9in59MYzxcCUDIdRL9jUASsd5lKdz00ojdbF7nj`);
const openaiApiKey = "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";

// Initialize the Express app
const app = express();

// Enable CORS
app.use(cors({origin: true}));

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
      currency: "inr",
    });

    console.log("Payment successful! Amount:", total);

    response.status(201).send({clientSecret: paymentIntent.client_secret});
  } catch (error) {
    console.error("Error creating payment intent:", error);
    response.status(500).send(
        {error: "An error occurred while creating payment intent"});
  }
});

// Expose OpenAI API key endpoint
app.get("/help", (request, response) => {
  response.status(200).send({key: openaiApiKey});
});

// Export the Express app as a Cloud Function
exports.api = functions.https.onRequest(app);
