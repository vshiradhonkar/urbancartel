import "../App.css";
import React, { useEffect, useState } from 'react';
import { firestore } from '../firebase'; // Import firestore from firebase.js

function Orders({ user }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch orders from Firebase Firestore
    const fetchOrders = async () => {
      try {
        if (user) {
          const snapshot = await firestore
            .collection('users')
            .doc(user?.uid)
            .collection('orders')
            .orderBy('created', 'desc')
            .get();

          const ordersData = snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data()
          }));

          setOrders(ordersData);
        } else {
          setOrders([]); // If user is not logged in, clear orders
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [user]); // Fetch orders whenever the user changes

  return (
    <div className='order-history'>
      <h2>Order History</h2>
      <p>
        Check the status of recent orders, manage returns, and discover similar
        products.
      </p>
      <div className='order-list'>
        {orders.map(order => (
          <div key={order.id} className='order-item'>
            <div className='order-details'>
              <p>Order number: {order.data.orderNumber}</p>
              <p>Date placed: {order.data.datePlaced}</p>
              <p>Total amount: {order.data.totalAmount}</p>
            </div>
            <div className='order-items'>
              {order.data.items.map(item => (
                <div key={item.id} className='order-item-details'>
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                  <p>{item.description}</p>
                  {/* Additional item details here */}
                </div>
              ))}
            </div>
            <div className='order-status'>
              <p>Delivered on {order.data.deliveryDate}</p>
              {/* Additional status details here */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;