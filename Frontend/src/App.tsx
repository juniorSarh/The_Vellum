import "./App.css";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
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
  // 🔐 adjust this selector to match your store shape
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth?.isAuthenticated
  );

  return (
    <Routes>
      {/* ---------- Public routes ---------- */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/hotel/:id" element={<HotelDetail />} />

      {/* ---------- Protected routes ---------- */}
      <Route element={<ProtectedRoute isAuthenticated={!!isAuthenticated} />}>
        <Route path="/home" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/booking-history" element={<BookingHistory />} />

        {/* Admin-style routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/registered-users" element={<RegisteredUsers />} />
        <Route path="/add-hotel" element={<AddHotel />} />
        <Route path="/add-admin" element={<AddAdmin />} />
        <Route path="/admin-profile" element={<AdminProfile />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Error404/>} />
    </Routes>
  );
}

export default App;
