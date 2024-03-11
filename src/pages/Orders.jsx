import React from 'react';
import "../App.css";

function Orders() {
  return (
    <div className="order-history">
      <h2>Order History</h2>
      <p>
        Check the status of recent orders, manage returns, and discover similar
        products.
      </p>
      <div className="order-list">
        <div className="order-item">
          <div className="order-details">
            <p>Order number: WU88191111</p>
            <p>Date placed: Jul 6, 2021</p>
            <p>Total amount: $160.00</p>
          </div>
          <div className="order-actions">
            <a href="#/" className="button">View Order</a>
            <a href="#/" className="button">View Invoice</a>
          </div>
        </div>
        <div className="order-items">
          <div className="order-item-details">
            <p>Micro Backpack</p>
            <p>$70.00</p>
            <p>
              Are you a minimalist looking for a compact carry option? The Micro
              Backpack is the perfect size for your essential everyday carry
              items. Wear it like a backpack or carry it like a satchel for
              all-day use.
            </p>
            <div className="order-item-actions">
              <a href="#/shop" className="orders-button">View Product</a>
              <a href="#/shop" className="orders-button">Buy Again</a>
            </div>
          </div>
          <div className="order-item-details">
            <p>Nomad Shopping Tote</p>
            <p>$90.00</p>
            <p>
              The durable shopping tote is perfect for the world traveler. Its
              yellow construction is water, fray, tear resistant. The matching
              handle, backpack straps, and shoulder loops provide multiple carry
              options for all your shopping needs.
            </p>
          </div>
        </div>
        <div className="order-status">
          <p>Delivered on July 12, 2021</p>
        </div>
      </div>
    </div>
  );
}

export default Orders;
