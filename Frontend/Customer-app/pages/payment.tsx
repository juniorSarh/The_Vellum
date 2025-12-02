import React from "react";
import PaymentCard from "../../src/components/paymentCard";
import "../../src/paymentScreen.css";
import Footer from "../../src/components/Footer";
import PrivateNav from "../../src/components/PrivatNav";

const PaymentScreen: React.FC = () => {
  return (
    <div className="payment-screen">
      <PrivateNav/>
      
      <div className="payment-center">
        <PaymentCard />
      </div>

      <Footer/>
    </div>
  );
};

export default PaymentScreen;
