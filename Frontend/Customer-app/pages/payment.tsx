import React from "react";
import PaymentCard from "../../src/components/paymentCard";
import "../../src/paymentScreen.css";
import Footer from "../../src/components/Footer";
import NavBar from "../../src/components/PrivateNaveBar";

const PaymentScreen: React.FC = () => {
  return (
    <div className="payment-screen">
      <NavBar/>
      
      <div className="payment-center">
        <PaymentCard />
      </div>

      <Footer/>
    </div>
  );
};

export default PaymentScreen;
