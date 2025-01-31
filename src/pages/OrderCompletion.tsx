import React from "react";
import { useLocation } from "react-router-dom";

const OrderCompletionPage: React.FC = () => {
  const location = useLocation();
  const { status, orderId } = location.state || {
    status: "unknown",
    orderId: null,
  };

  const renderMessage = () => {
    switch (status) {
      case "success":
        return (
          <div>
            <h1>Order Completed Successfully!</h1>
            <p>Your order ID is: {orderId}</p>
            <p>Thank you for your purchase!</p>
          </div>
        );
      case "canceled":
        return (
          <div>
            <h1>Order Canceled</h1>
            <p>
              Your order has been canceled. If you have any questions, please
              contact support.
            </p>
          </div>
        );
      case "failed":
        return (
          <div>
            <h1>Payment Failed</h1>
            <p>
              Unfortunately, your payment could not be processed. Please try
              again.
            </p>
          </div>
        );
      default:
        return (
          <div>
            <h1>Order Status Unknown</h1>
            <p>
              We are unable to determine the status of your order. Please
              contact support.
            </p>
          </div>
        );
    }
  };

  return <div>{renderMessage()}</div>;
};

export default OrderCompletionPage;
