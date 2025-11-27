import { useEffect, useMemo } from "react";
import PrivatNav from "../../src/components/PrivatNav";
import Footer from "../../src/components/Footer";
import Button from "../../src/components/Button";
import { Link } from "react-router-dom";
import StatCard from "../../src/components/statCard";
import Table from "../../src/components/Table";
import "../../src/dashboardPage.css";
import {
  FaHome,
  FaMoneyBillWave,
  FaClipboardList,
  FaHotel,
} from "react-icons/fa";

import {
  useAppDispatch,
  useAppSelector,
} from "../../src/storeSlices/hooks";
import {
  fetchBookings,
  type Booking,
} from "../../src/storeSlices/bookingSlice";

export default function DashboardPage() {
  const dispatch = useAppDispatch();

  const { bookings, loading, error } = useAppSelector(
    (state) => state.booking
  );

  // 🔹 Hotels slice (adjust path to your actual slice if different)
  const hotels = useAppSelector(
    (state: any) => state.hotel?.hotels || []
  );

  // 🔹 Rooms slice (used to map room_id -> hotel_id)
  const rooms = useAppSelector(
    (state: any) => state.room?.rooms || []
  );

  // 🔹 Customers slice (for guest names)
  const customers = useAppSelector(
    (state: any) => state.customer?.customers || []
  );

  // Fetch bookings on mount
  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  // -----------------------------
  // Helpers to join data
  // -----------------------------

  const getGuestName = (booking: Booking): string => {
    const match = customers.find(
      (c: any) => c.customer_id === booking.customer_id
    );

    if (match) {
      const first = match.first_name || match.firstname || match.name || "";
      const last = match.last_name || match.surname || "";
      const full = `${first} ${last}`.trim();
      if (full) return full;
    }

    return `Customer #${booking.customer_id}`;
  };

  const getHotelName = (booking: Booking): string => {
    // 1️⃣ Find room by room_id
    const room = rooms.find(
      (r: any) => r.room_id === booking.room_id
    );

    if (room) {
      // 2️⃣ Find hotel using room.hotel_id
      const hotel = hotels.find(
        (h: any) => h.hotel_id === room.hotel_id
      );
      if (hotel?.name) return hotel.name;

      // Fallback if hotel not found
      if (room.room_type) {
        return `Room ${room.room_type} (#${room.room_id})`;
      }
    }

    return `Room #${booking.room_id}`;
  };

  // -----------------------------
  // Stats + Latest bookings (max 15)
  // -----------------------------

  const {
    latestBookingsForTable,
    totalReservations,
    successRate,
    occupancyRate,
    totalHotels,
  } = useMemo(() => {
    if (!bookings || bookings.length === 0) {
      return {
        latestBookingsForTable: [],
        totalReservations: 0,
        successRate: "0%",
        occupancyRate: "0%",
        totalHotels: Array.isArray(hotels) ? hotels.length : 0,
      };
    }

    const total = bookings.length;

    const successStatuses = ["paid", "confirmed", "completed"];
    const activeStatuses = ["paid", "confirmed", "completed", "pending"];

    const successfulCount = bookings.filter((b) =>
      successStatuses.includes(b.status.toLowerCase())
    ).length;

    const activeCount = bookings.filter((b) =>
      activeStatuses.includes(b.status.toLowerCase())
    ).length;

    const successRateNum =
      total > 0 ? Math.round((successfulCount / total) * 100) : 0;
    const occupancyRateNum =
      total > 0 ? Math.round((activeCount / total) * 100) : 0;

    // Sort by check_in_date (newest first)
    const sorted = [...bookings].sort((a: Booking, b: Booking) => {
      const aDate = new Date(a.check_in_date).getTime();
      const bDate = new Date(b.check_in_date).getTime();
      return bDate - aDate;
    });

    // Take max 15
    const top15 = sorted.slice(0, 15);

    // Map to Table data shape
    const dataForTable = top15.map((b) => ({
      guest: getGuestName(b),
      hotel: getHotelName(b),
      checkin: b.check_in_date,
      checkout: b.check_out_date,
      status: b.status,
    }));

    return {
      latestBookingsForTable: dataForTable,
      totalReservations: total,
      successRate: `${successRateNum}%`,
      occupancyRate: `${occupancyRateNum}%`,
      totalHotels: Array.isArray(hotels) ? hotels.length : 0,
    };
  }, [bookings, hotels, rooms, customers]);

  // -----------------------------
  // Render
  // -----------------------------

  return (
    <div>
      <div className="nav">
        <PrivatNav />
      </div>

      <div className="dash">
        {/* Top buttons */}
        <div className="btns">
          <Link to="/reservations" className="link-reset">
            <Button
              name="Resevations"
              color="white"
              backgroundColor="black"
              className="dashbtn"
            />
          </Link>

          <Link to="/registered-users" className="link-reset">
            <Button
              name="Users"
              color="white"
              backgroundColor="black"
              className="dashbtn"
            />
          </Link>

          <Link to="/add-admin" className="link-reset">
            <Button
              name="Add Admin"
              color="white"
              backgroundColor="black"
              className="dashbtn"
            />
          </Link>

          <Link to="/add-hotel" className="link-reset">
            <Button
              name="Add Hotels"
              color="white"
              backgroundColor="black"
              className="dashbtn"
            />
          </Link>
        </div>

        {/* Stat cards */}
        <div>
          <div className="cards" style={{ display: "flex", gap: "20px" }}>
            <StatCard
              title="Occupancy rate"
              value={occupancyRate}
              icon={<FaHome />}
            />
            <StatCard
              title="Successful payments"
              value={successRate}
              icon={<FaMoneyBillWave />}
            />
            <StatCard
              title="Total reservations"
              value={totalReservations.toString()}
              icon={<FaClipboardList />}
            />
            <StatCard
              title="Total hotels"
              value={totalHotels.toString()}
              icon={<FaHotel />}
            />
          </div>
        </div>

        {/* Latest bookings table */}
        <div className="tablee">
          <h2>Latest Bookings</h2>

          {loading && <p>Loading latest bookings...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {!loading && !error && latestBookingsForTable.length === 0 && (
            <p>No bookings found.</p>
          )}

          {!loading && !error && latestBookingsForTable.length > 0 && (
            <Table data={latestBookingsForTable} />
          )}
        </div>
      </div>

      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}
