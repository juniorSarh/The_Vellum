import "./App.css";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "./storeSlices/hooks";
import type { RootState } from "../store";


import Landing from "../public_pages/landing";
import Login from "../public_pages/login";
import Register from "../public_pages/register";
import Home from "../Customer-app/pages/home";
import HotelDetail from "../public_pages/hoteldetails";
import Checkout from "../Customer-app/pages/checkout";
import Payment from "../Customer-app/pages/payment";
import UserProfile from "../Customer-app/pages/userprofile";
import Favourites from "../Customer-app/pages/favourites";
import BookingHistory from "../Customer-app/pages/bookinghistory";
import Dashboard from "../CMS/pages/dashboard";
import Reservations from "../CMS/pages/reservations";
import RegisteredUsers from "../CMS/pages/registeredusers";
import AddHotel from "../CMS/pages/addhotel";
import AddAdmin from "../CMS/pages/addadmin";
import AdminProfile from "../CMS/pages/adminprofile";
import Error404 from "../public_pages/error404";
import PaymentDialog from "./components/paymentDialogue";

// ---- ProtectedRoute wrapper ----
type ProtectedRouteProps = {
  isAuthenticated: boolean;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

function App() {
  // Use customerSlice state with proper typing
  const user = useAppSelector((state: RootState) => state.customer);
  const isAuthenticated = Boolean(user);

  return (
    <>
        <PaymentDialog isOpen={true} onClose={() => {}} onSubmit={() => {}} />

    </>
  );
}

export default App;
