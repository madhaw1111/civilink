import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyOrderPage.css";

function MyOrderPage() {
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
  try {
    const res = await axios.get("/api/order");

    const phone = localStorage.getItem("customerPhone");

    const myOrders = (res.data.orders || []).filter(
      order => order.customer?.phone === phone
    );

    setOrders(myOrders);

  } catch (err) {
    console.error("Orders load failed", err);
  }
};
  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="myorders-page">
  <h2>My Orders</h2>

  {orders.length === 0 ? (
    <p>No orders yet.</p>
  ) : (
    <div className="myorders-list">
      {orders.map(order => (
        <div key={order._id} className="order-card">

          <div className="order-top">
            <div>
              <strong>Ordered on</strong><br/>
              {new Date(order.createdAt).toLocaleString()}
            </div>

            <div>
              <strong>Total</strong><br/>
              ₹{order.total}
            </div>

            <div>
              <strong>Status</strong><br/>
              {order.status}
            </div>

            <div>
              <strong>Invoice</strong><br/>
              {order.invoiceUrl && (
                <a href={order.invoiceUrl} target="_blank" rel="noreferrer">
                  Download
                </a>
              )}
            </div>
          </div>

          <div className="order-items">
            {order.items.map((item,i)=>(
              <div key={i} className="order-item">
                <div className="item-name">{item.name}</div>
                <div className="item-meta">
                  Qty: {item.quantity}
                  {item.size && ` | Size: ${item.size}`}
                </div>
              </div>
            ))}
          </div>

        </div>
      ))}
    </div>
  )}
</div>
  );
}

export default MyOrderPage;