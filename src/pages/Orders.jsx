import React, { useEffect, useState } from 'react';
import { auth, firestore } from '../firebase';
import { SunspotLoader } from 'react-awesome-loaders-py3';
import data from "../components/Shop-page/db/data";
import '../App.css'; // Import the CSS file

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        fetchOrders(user.uid);
      } else {
        setLoading(false);
        setOrders([]);
      }
    });

    return () => unsubscribe();
  }, []);


  
  const fetchOrders = async (userId) => {
    try {
      // Fetch orders from Firestore for the current user
      const ordersRef = firestore.collection('orders').where('userId', '==', userId);
      const snapshot = await ordersRef.get();

      // Extract data from the snapshot
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setOrders(ordersData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const findItemDetails = (items) => {
    return items.map(item => {
      const foundItem = data.find(dataItem => dataItem.title === item.title);
      return foundItem ? { ...item, imageUrl: foundItem.img } : null;
    });
  };

  return (
    <div className="orders-container">
          <div className='bg-grad-3'></div>
      <div className='bg-grad-4'></div>
      <h2 className="orders-summary">Order History</h2>
      {loading ? (
        <div className="loader-container">
          <SunspotLoader
            gradientColors={["#fe330a", "#E0E7FF"]}
            shadowColor={"#9fa330"}
            desktopSize={"50px"}
            mobileSize={"40px"}
          />
        </div>
      ) : (
        <div>
          {orders.length === 0 ? (
            <p className="no-orders-message">No orders found.</p>
          ) : (
            <div>
              {orders.map(order => (
                <div key={order.id} className="order-card">
                  <div className="order-details">
                    <div className="order-info">
                      <h3 className="order-id">Order ID: {order.id}</h3>
                      <div className="order-items">
                        <h4>Items:</h4>
                        <ul>
                          {findItemDetails(order.items).map((item, index) => (
                            <li key={index} className="order-item">
                              <div className="item-details">
                                <p>Price: {item.price}</p>
                                <p>Quantity: {item.quantity}</p>
                              </div>
                              <div className="order-images">
                                <img
                                  src={item.imageUrl}
                                  alt={`Item ${index + 1}`}
                                  className="order-image"
                                />
                              </div>
                              <div className="item-title">{item.title}</div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Orders;
