const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(functions.config().stripe.key);
const openaiApiKey = functions.config().openai.key;

// Initialize the Express app
const app = express();

// Enable CORS
app.use(cors({ origin: true }));

app.get("/", (request, response) =>
  response.status(200).send("hello world")
);

// Define your API routes
app.post("/cart/create", async (request, response) => {
  const total = request.query.total;

  console.log("payment request received, For this amount >>> ", total);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "inr",
    });

    console.log("Payment successful! Amount:", total);

    response.status(201).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    response
      .status(500)
      .send({ error: "An error occurred while creating payment intent" });
  }
});

// Expose OpenAI API key endpoint
app.get("/openai-key", (request, response) => {
  response.status(200).send({ key: openaiApiKey });
});

// Export the Express app as a Cloud Function
exports.api = functions.https.onRequest(app);